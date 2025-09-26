export class VideoUpdateDTO {
  public id: string;
  public youtubeVideoId?: string;
  public title?: string;
  public description?: string;
  public thumbnailUrl?: string;
  public publishedAt?: Date;
  public channelTitle?: string;
  public tags?: string;

  constructor(
    id: string,
    {
      youtubeVideoId,
      title,
      description,
      thumbnailUrl,
      publishedAt,
      channelTitle,
      tags,
    }: {
      youtubeVideoId?: string;
      title?: string;
      description?: string;
      thumbnailUrl?: string;
      publishedAt?: Date;
      channelTitle?: string;
      tags?: string;
    }
  ) {
    this.id = id;
    this.youtubeVideoId = youtubeVideoId;
    this.title = title;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.publishedAt = publishedAt;
    this.channelTitle = channelTitle;
    this.tags = tags;
  }
}