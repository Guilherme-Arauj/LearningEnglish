import { Video } from "../../domain/entities/Video";
import { IVideoRepository } from "./repositories/IVideoRepository";
import { IUuidConfig } from "../../infrastructure/utils/uuid/IUuidConfig";
import { CreateVideoDTO } from "../dto/video/CreateVideoDTO";
import { VideoResponseDTO } from "../dto/video/VideoResponseDTO";
import { VideoUpdateDTO } from "../dto/video/VideoUpdateDTO";
import { VideoDeleteDTO } from "../dto/video/VideoDeleteDTO";
import { IUserRepository } from "./repositories/IUserRepository";
import { log } from "console";
import { IUserVideoProgressRepository } from "./repositories/IUserVideoProgressRepository";
import { IUserQuestionProgressRepository } from "./repositories/IUserQuestionProgressRepository";
import { UserVideoProgress } from "../../domain/entities/UserVideoProgress";
import { UserQuestionProgress } from "../../domain/entities/UserQuestionProgress";

export class VideoService {
  constructor(
    private videoRepository: IVideoRepository,
    private userRepository: IUserRepository,
    private userVideoProgressRepository: IUserVideoProgressRepository,
    private userQuestionProgressRepository: IUserQuestionProgressRepository,
    private uuidConfig: IUuidConfig
  ) {}

  public async createVideo(dto: CreateVideoDTO): Promise<VideoResponseDTO> {
    const existingVideo = await this.videoRepository.findVideoByYoutubeId(
      dto.youtubeVideoId
    );
    if (existingVideo) {
      throw new Error("Vídeo já existe no banco de dados");
    }

    const id = await this.uuidConfig.generateVideoId();

    const video = new Video({
      id,
      youtubeVideoId: dto.youtubeVideoId,
      title: dto.title,
      description: dto.description,
      thumbnailUrl: dto.thumbnailUrl,
      publishedAt: dto.publishedAt,
      channelTitle: dto.channelTitle,
      tags: dto.tags,
      status: "ACTIVE",
      cefr: dto.cefr,
      createdAt: new Date(),
    });
    const saved = await this.videoRepository.create(video);

    return VideoResponseDTO.fromVideo(saved);
  }

  public async updateVideo(dto: VideoUpdateDTO): Promise<VideoResponseDTO> {
    const existingVideo = await this.videoRepository.getVideoById(dto.id);
    if (!existingVideo) {
      throw new Error("Vídeo não encontrado");
    }

    if (
      dto.youtubeVideoId &&
      dto.youtubeVideoId !== existingVideo.youtubeVideoId
    ) {
      const videoExists = await this.videoRepository.findVideoByYoutubeId(
        dto.youtubeVideoId
      );
      if (videoExists) {
        throw new Error("YouTube Video ID já está em uso por outro vídeo");
      }
    }

    const updateMethods = {
      youtubeVideoId: (video: Video, value: string) =>
        (video.youtubeVideoId = value),
      title: (video: Video, value: string) => (video.title = value),
      description: (video: Video, value: string) => (video.description = value),
      thumbnailUrl: (video: Video, value: string) =>
        (video.thumbnailUrl = value),
      channelTitle: (video: Video, value: string) =>
        (video.channelTitle = value),
      tags: (video: Video, value: string) => (video.tags = value),
      cefr: (video: Video, value: string) => (video.cefr = value),
    } as const;

    (
      Object.entries(updateMethods) as Array<
        [
          keyof typeof updateMethods,
          (typeof updateMethods)[keyof typeof updateMethods]
        ]
      >
    ).forEach(([field, updateFn]) => {
      if (dto[field] !== undefined) {
        updateFn(existingVideo, dto[field]);
      }
    });

    if (dto.publishedAt !== undefined) {
      existingVideo.publishedAt = dto.publishedAt;
    }

    existingVideo.updatedAt = new Date();

    const savedVideo = await this.videoRepository.update(existingVideo);
    return VideoResponseDTO.fromVideo(savedVideo);
  }

  public async deleteVideo(dto: VideoDeleteDTO): Promise<VideoResponseDTO> {
    const existingVideo = await this.videoRepository.getVideoById(dto.id);
    if (!existingVideo) {
      throw new Error("Vídeo não encontrado");
    }

    existingVideo.status = "DELETED";
    existingVideo.updatedAt = new Date();

    const deletedVideo = await this.videoRepository.update(existingVideo);
    return VideoResponseDTO.fromVideo(deletedVideo);
  }

  public async getAllVideos(): Promise<VideoResponseDTO[]> {
    const videos = await this.videoRepository.getAllVideos();
    return videos.map((video) => VideoResponseDTO.fromVideo(video));
  }

  public async getVideosByUserTimeline(userId: string): Promise<any[]> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.timeline) {
      throw new Error("Usuário não possui timeline definida");
    }

    // Verificar se usuário já tem progresso (evitar duplicatas)
    const jaTemProgresso = await this.userVideoProgressRepository.countByUserId(
      userId
    );

    if (jaTemProgresso > 0) {
      throw new Error("Usuário já possui conteúdo associado");
    }

    const videosWithQuestions =
      await this.videoRepository.getVideosWithQuestionsByTimeline(
        user.timeline
      );

    // Criar UserVideoProgress para cada vídeo
    for (const video of videosWithQuestions) {
      const userVideoProgress = new UserVideoProgress({
        id: await this.uuidConfig.generateVideoId(), // ou generateId()
        userId: userId,
        videoId: video.id,
        status: false,
      });

      await this.userVideoProgressRepository.create(userVideoProgress);

      // Criar UserQuestionProgress para cada questão do vídeo
      for (const question of video.questions) {
        const userQuestionProgress = new UserQuestionProgress({
          id: await this.uuidConfig.generateVideoId(), // ou generateId()
          userId: userId,
          questionId: question.id,
          status: false,
        });

        await this.userQuestionProgressRepository.create(userQuestionProgress);
      }
    }

    return videosWithQuestions.map((video) => ({
      id: video.id,
      title: video.title,
      cefr: video.cefr,
      type: video.type,
      theme: video.theme,
      youtubeVideoId: video.youtubeVideoId,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      publishedAt: video.publishedAt,
      channelTitle: video.channelTitle,
      tags: video.tags,
      status: video.status,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      questions: video.questions.map((question: any) => ({
        id: question.id,
        videoId: question.videoId,
        title: question.title,
        cefr: question.cefr,
        type: question.type,
        theme: question.theme,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        response: question.response,
        status: question.status,
        deletedAt: question.deletedAt,
      })),
    }));
  }

  public async getMyContent(userId: string): Promise<any[]> {
    const videosWithProgress =
      await this.userVideoProgressRepository.findByUserIdWithVideos(userId);

    if (videosWithProgress.length === 0) {
      throw new Error("Usuário não possui conteúdo associado");
    }

    const result = [];

    for (const videoProgress of videosWithProgress) {
      const questionsProgress =
        await this.userQuestionProgressRepository.findByUserIdAndVideoId(
          userId,
          videoProgress.videoId
        );

      result.push({
        id: videoProgress.video.id,
        title: videoProgress.video.title,
        cefr: videoProgress.video.cefr,
        type: videoProgress.video.type,
        theme: videoProgress.video.theme,
        youtubeVideoId: videoProgress.video.youtubeVideoId,
        description: videoProgress.video.description,
        thumbnailUrl: videoProgress.video.thumbnailUrl,
        publishedAt: videoProgress.video.publishedAt,
        channelTitle: videoProgress.video.channelTitle,
        tags: videoProgress.video.tags,
        status: videoProgress.video.status,
        createdAt: videoProgress.video.createdAt,
        updatedAt: videoProgress.video.updatedAt,
        userProgress: {
          id: videoProgress.id,
          status: videoProgress.status,
        },
        questions: questionsProgress.map((qp) => ({
          id: qp.question.id,
          videoId: qp.question.videoId,
          title: qp.question.title,
          cefr: qp.question.cefr,
          type: qp.question.type,
          theme: qp.question.theme,
          optionA: qp.question.optionA,
          optionB: qp.question.optionB,
          optionC: qp.question.optionC,
          response: qp.question.response,
          status: qp.question.status,
          deletedAt: qp.question.deletedAt,
          userProgress: {
            id: qp.id,
            status: qp.status,
            chosenOption: qp.chosenOption,
          },
        })),
      });
    }

    return result;
  }
}
