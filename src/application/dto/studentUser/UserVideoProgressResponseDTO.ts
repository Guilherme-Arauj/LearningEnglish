import {
  UserVideoProgress,
} from "../../../domain/entities/UserVideoProgress";

export class UserVideoProgressResponseDTO {
  public id: string;
  public userId?: string;
  public videoId?: string;
  public status?: boolean;
  public video?: {
    title: string;
    cefr: string;
    type: string;
    theme: string;
    youtubeVideoId: string;
    description: string;
    thumbnailUrl: string;
  } | null;

  constructor(
    id: string,
    userId?: string,
    videoId?: string,
    status?: boolean,
    video?: {
      title: string;
      cefr: string;
      type: string;
      theme: string;
      youtubeVideoId: string;
      description: string;
      thumbnailUrl: string;
    } | null
  ) {
    this.id = id;
    this.userId = userId;
    this.videoId = videoId;
    this.status = status;
    this.video = video;
  }

  static fromUserVideoProgress(
    userVideoProgress: UserVideoProgress
  ): UserVideoProgressResponseDTO {
    const publicData = userVideoProgress.toPublicData();
    return new UserVideoProgressResponseDTO(
      publicData.id,
      publicData.userId,
      publicData.videoId,
      publicData.status,
      publicData.video
        ? {
            title: publicData.video.title || "",
            cefr: publicData.video.cefr || "",
            type: publicData.video.type || "",
            theme: publicData.video.theme || "",
            youtubeVideoId: publicData.video.youtubeVideoId || "",
            description: publicData.video.description || "",
            thumbnailUrl: publicData.video.thumbnailUrl || "",
          }
        : null
    );
  }
}