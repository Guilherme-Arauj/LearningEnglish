import { log } from "console";
import { Video } from "../../../domain/entities/Video";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";
import { IVideoRepository } from "./IVideoRepository";

export class VideoRepository implements IVideoRepository {
  constructor(private prismaConfig: IPrismaConfig) {}

  private get prisma() {
    return this.prismaConfig.prisma;
  }

  public async create(video: Video): Promise<Video> {
    const created = await this.prisma.video.create({
      data: video.toPersistenceForCreate(),
    });
    return this.mapToEntity(created);
  }

  public async update(video: Video): Promise<Video> {
    const data = video.toPersistenceForUpdate();
    const updated = await this.prisma.video.update({
      where: { id: video.id },
      data: {
        youtubeVideoId: data.youtubeVideoId,
        title: data.title,
        cefr: data.cefr,
        type: data.type,
        theme: data.theme,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        publishedAt: data.publishedAt,
        channelTitle: data.channelTitle,
        tags: data.tags,
        status: data.status,
        updatedAt: data.updatedAt,
      },
    });
    return this.mapToEntity(updated);
  }

  public async getAllVideos(): Promise<Video[]> {
    const videos = await this.prisma.video.findMany();
    return videos.map((prismaVideo: any) => this.mapToEntity(prismaVideo));
  }

  public async getAllActiveVideos(): Promise<Video[]> {
    const videos = await this.prisma.video.findMany({
      where: { status: "ACTIVE" },
    });
    return videos.map((prismaVideo: any) => this.mapToEntity(prismaVideo));
  }

  public async getVideoById(id: string): Promise<Video> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });
    return this.mapToEntity(video);
  }

  public async delete(id: string): Promise<Video> {
    const deleted = await this.prisma.video.delete({
      where: { id },
    });
    return this.mapToEntity(deleted);
  }

  public async findVideoByYoutubeId(youtubeId: string): Promise<Video | null> {
    const video = await this.prisma.video.findUnique({
      where: { youtubeVideoId: youtubeId },
    });

    if (!video) return null;

    return this.mapToEntity(video);
  }

  public async getVideosWithQuestionsByTimeline(
    timeline: number
  ): Promise<any[]> {
    let percentual: number;

    switch (timeline) {
      case 3:
        percentual = 1 / 3;
        break;
      case 6:
        percentual = 2 / 3;
        break;
      case 12:
        percentual = 1;
        break;
      default:
        throw new Error("Timeline inválida");
    }

    const todosVideos = await this.prisma.video.findMany({
      where: { status: "ACTIVE" },
      include: {
        questions: {
          where: { status: "ACTIVE" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const quantidadeParaEntregar = Math.max(1, Math.floor(todosVideos.length * percentual));

    const videosPorTheme = todosVideos.reduce((acc, video) => {
      const theme = video.theme || "sem_theme";
      if (!acc[theme]) acc[theme] = [];
      acc[theme].push(video);
      return acc;
    }, {} as Record<string, any[]>);

    const themes = Object.keys(videosPorTheme);
    const videosPorTheme_ideal = Math.floor(
      quantidadeParaEntregar / themes.length
    );
    const resto = quantidadeParaEntregar % themes.length;

    let videosEquilibrados: any[] = [];

    themes.forEach((theme, index) => {
      const quantidadeParaEsteTheme =
        videosPorTheme_ideal + (index < resto ? 1 : 0);
      const videosDoTheme = videosPorTheme[theme].slice(
        0,
        quantidadeParaEsteTheme
      );
      videosEquilibrados.push(...videosDoTheme);
    });

    while (videosEquilibrados.length < quantidadeParaEntregar) {
      for (const theme of themes) {
        if (videosEquilibrados.length >= quantidadeParaEntregar) break;
        const jaUsados = videosEquilibrados.filter(
          (v) => v.theme === theme
        ).length;
        if (videosPorTheme[theme][jaUsados]) {
          videosEquilibrados.push(videosPorTheme[theme][jaUsados]);
        }
      }
    }

    return videosEquilibrados.slice(0, quantidadeParaEntregar);
  }

  private mapToEntity(prismaVideo: any): Video {
    return new Video({
      id: prismaVideo.id,
      title: prismaVideo.title,
      cefr: prismaVideo.cefr,
      type: prismaVideo.type ?? undefined,
      theme: prismaVideo.theme ?? undefined,
      youtubeVideoId: prismaVideo.youtubeVideoId,
      description: prismaVideo.description ?? undefined,
      thumbnailUrl: prismaVideo.thumbnailUrl ?? undefined,
      publishedAt: prismaVideo.publishedAt || undefined,
      channelTitle: prismaVideo.channelTitle ?? undefined,
      tags: prismaVideo.tags ?? undefined,
      status: prismaVideo.status,
      createdAt: prismaVideo.createdAt || undefined,
      updatedAt: prismaVideo.updatedAt || undefined,
    });
  }
}
