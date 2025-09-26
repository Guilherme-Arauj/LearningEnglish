export class CreateVideoDTO {
  public youtubeVideoId: string;
  public title: string;
  public description?: string;
  public thumbnailUrl?: string;
  public publishedAt?: Date;
  public channelTitle?: string;
  public tags?: string;

  constructor(
    youtubeVideoId: string,
    title: string,
    description?: string,
    thumbnailUrl?: string,
    publishedAt?: Date,
    channelTitle?: string,
    tags?: string
  ) {
    this.youtubeVideoId = youtubeVideoId;
    this.title = title;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.publishedAt = publishedAt;
    this.channelTitle = channelTitle;
    this.tags = tags;
  }
}