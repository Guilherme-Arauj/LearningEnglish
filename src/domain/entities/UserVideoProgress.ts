import { IVideo } from "./Video";
import { IUser } from "./User";

export interface IUserVideoProgress {
  id: string;
  userId?: string;
  videoId?: string;
  status?: boolean;
  user?: IUser;
  video?: IVideo;
}

export interface IUserVideoProgressPublicData {
  id: string;
  userId?: string;
  videoId?: string;
  status?: boolean;
  video?: IVideo;
}

export interface IUserVideoPersistence {
  id: string;
  userId?: string;
  videoId?: string;
  status?: boolean;
}

export class UserVideoProgress implements IUserVideoProgress {
  private _id: string;
  private _userId?: string;
  private _videoId?: string;
  private _status?: boolean;
  private _user?: IUser;
  private _video?: IVideo;

  constructor(data: IUserVideoProgress) {
    this._id = data.id;
    this._userId = data.userId;
    this._videoId = data.videoId;
    this._status = data.status;
    this._user = data.user;
    this._video = data.video;
  }

  get id(): string { return this._id; }
  get userId(): string | undefined { return this._userId; }
  get videoId(): string | undefined { return this._videoId; }
  get status(): boolean | undefined { return this._status; }
  get user(): IUser | undefined { return this._user; }
  get Video(): IVideo | undefined { return this._video; }

  set userId(userId: string | null) {
    this._userId = userId || undefined;
  }

  set videoId(videoId: string | null) {
    this._videoId = videoId || undefined;
  }

  set status(status: boolean | null) {
    this._status = status ?? undefined;
  }

  //------ Métodos para exposição de dados ----------
  public toPublicData(): IUserVideoProgressPublicData {
    return {
      id: this._id,
      userId: this._userId,
      videoId: this._videoId,
      status: this._status,
      video: this._video,
    };
  }

  public toPersistence(): IUserVideoPersistence {
    return {
      id: this._id,
      userId: this._userId,
      videoId: this._videoId,
      status: this._status,
    };
  }
  //------ ---------------------------- ------------
}