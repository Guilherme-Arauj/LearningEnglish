import { Video } from "../../domain/entities/Video";
import { IVideoRepository } from "./repositories/IVideoRepository";
import { IUuidConfig } from "../../infrastructure/utils/uuid/IUuidConfig";
import { CreateVideoDTO } from "../dto/video/CreateVideoDTO";
import { VideoResponseDTO } from "../dto/video/VideoResponseDTO";
import { VideoUpdateDTO } from "../dto/video/VideoUpdateDTO";
import { VideoDeleteDTO } from "../dto/video/VideoDeleteDTO";

export class VideoService {
  constructor(
    private videoRepository: IVideoRepository,
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
}
