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
  public cefr: string;
  public status: string;
  
  // URLs formatadas do YouTube
  public youtubeUrl: string;
  public youtubeEmbedUrl: string;
  public youtubeShortUrl: string;

  constructor(
    id: string,
    youtubeVideoId: string,
    title: string,
    cefr: string,
    status: string,
    description?: string,
    thumbnailUrl?: string,
    publishedAt?: Date,
    channelTitle?: string,
    tags?: string,
  ) {
    this.id = id;
    this.youtubeVideoId = youtubeVideoId;
    this.title = title;
    this.cefr = cefr;
    this.status = status;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.publishedAt = publishedAt;
    this.channelTitle = channelTitle;
    this.tags = tags;
    
    // Gerar URLs automaticamente
    this.youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
    this.youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}`;
    this.youtubeShortUrl = `https://youtu.be/${youtubeVideoId}`;
  }

  static fromVideo(video: Video): VideoResponseDTO {
    return new VideoResponseDTO(
      video.id,
      video.youtubeVideoId,
      video.title,
      video.cefr,
      video.status,
      video.description,
      video.thumbnailUrl,
      video.publishedAt,
      video.channelTitle,
      video.tags,
    );
  }
}
