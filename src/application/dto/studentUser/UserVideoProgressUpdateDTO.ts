export class UserVideoProgressUpdateDTO {
  public id: string;
  public userId?: string | null;
  public videoId?: string | null;
  public status?: boolean | null;

  constructor(
    id: string,
    data: {
      userId?: string | null;
      videoId?: string | null;
      status?: boolean | null;
    }
  ) {
    this.id = id;
    this.userId = data.userId ?? null;
    this.videoId = data.videoId ?? null;
    this.status = data.status ?? null;
  }
}