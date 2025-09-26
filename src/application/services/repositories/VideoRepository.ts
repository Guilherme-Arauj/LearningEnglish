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
    const data = video.toPersistenceForCreate();
    const created = await this.prisma.video.create({
      data: {
        ...data,
      },
    });

    console.log(data, created);

    return this.mapToEntity(created);
  }

  public async update(video: Video): Promise<Video> {
    const data = video.toPersistenceForUpdate();
    const updated = await this.prisma.video.update({
      where: { id: video.id },
      data: {
        youtubeVideoId: data.youtubeVideoId,
        title: data.title,
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

  private mapToEntity(prismaVideo: any): Video {
    return new Video({
      id: prismaVideo.id,
      youtubeVideoId: prismaVideo.youtubeVideoId,
      title: prismaVideo.title,
      description: prismaVideo.description ?? undefined,
      thumbnailUrl: prismaVideo.thumbnailUrl ?? undefined,
      publishedAt: prismaVideo.publishedAt || undefined,
      channelTitle: prismaVideo.channelTitle ?? undefined,
      tags: prismaVideo.tags ?? undefined,
      createdAt: prismaVideo.createdAt || undefined,
      updatedAt: prismaVideo.updatedAt || undefined,
    });
  }
}
