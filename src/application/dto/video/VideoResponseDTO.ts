import { Video } from "../../../domain/entities/Video";

export class VideoResponseDTO {
  public id: string;
  public youtubeVideoId: string;
  public title: string;
  public description?: string;
  public thumbnailUrl?: string;
  public publishedAt?: Date;
  public channelTitle?: string;
  public tags?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(
    id: string,
    youtubeVideoId: string,
    title: string,
    description?: string,
    thumbnailUrl?: string,
    publishedAt?: Date,
    channelTitle?: string,
    tags?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.youtubeVideoId = youtubeVideoId;
    this.title = title;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.publishedAt = publishedAt;
    this.channelTitle = channelTitle;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromVideo(video: Video): VideoResponseDTO {
    const publicData = video.toPublicData();
    return new VideoResponseDTO(
      publicData.id,
      publicData.youtubeVideoId,
      publicData.title,
      publicData.description,
      publicData.thumbnailUrl,
      publicData.publishedAt,
      publicData.channelTitle,
      publicData.tags,
      video.createdAt,
      video.updatedAt
    );
  }
}
