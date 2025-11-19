import { IUserVideoProgress } from "./UserVideoProgress";

export interface IVideo {
  id: string;
  title: string;
  cefr: string;
  type?: string;
  theme?: string;
  youtubeVideoId: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: Date;
  channelTitle?: string;
  tags?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  userVideoProgress?: IUserVideoProgress[];
}

export interface IVideoPublicData {
  id: string;
  title: string;
  cefr: string;
  type?: string;
  theme?: string;
  youtubeVideoId: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: Date;
  channelTitle?: string;
  tags?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVideoPersistence {
  id: string;
  title: string;
  cefr: string;
  type?: string;
  theme?: string;
  youtubeVideoId: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: Date;
  channelTitle?: string;
  tags?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Video implements IVideo {
  private _id: string;
  private _title: string;
  private _cefr: string;
  private _type?: string;
  private _theme?: string;
  private _youtubeVideoId: string;
  private _description?: string;
  private _thumbnailUrl?: string;
  private _publishedAt?: Date;
  private _channelTitle?: string;
  private _tags?: string;
  private _status: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _userVideoProgress?: IUserVideoProgress[];

  constructor(data: IVideo) {
    this.validateRequiredFields(data);
    this.validateCefr(data.cefr);

    this._id = data.id;
    this._title = data.title;
    this._cefr = data.cefr;
    this._type = data.type;
    this._theme = data.theme;
    this._youtubeVideoId = data.youtubeVideoId;
    this._description = data.description;
    this._thumbnailUrl = data.thumbnailUrl;
    this._publishedAt = data.publishedAt;
    this._channelTitle = data.channelTitle;
    this._tags = data.tags;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._userVideoProgress = data.userVideoProgress;
  }

  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get cefr(): string { return this._cefr; }
  get type(): string | undefined { return this._type; }
  get theme(): string | undefined { return this._theme; }
  get youtubeVideoId(): string { return this._youtubeVideoId; }
  get description(): string | undefined { return this._description; }
  get thumbnailUrl(): string | undefined { return this._thumbnailUrl; }
  get publishedAt(): Date | undefined { return this._publishedAt; }
  get channelTitle(): string | undefined { return this._channelTitle; }
  get tags(): string | undefined { return this._tags; }
  get status(): string { return this._status; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }
  get userVideoProgress(): IUserVideoProgress[] | undefined { return this._userVideoProgress; }

  set title(newTitle: string) {
    if (!newTitle?.trim()) {
      throw new Error("Título não pode ser vazio!");
    }
    this._title = newTitle.trim();
  }

  set cefr(newCefr: string) {
    this.validateCefr(newCefr);
    this._cefr = newCefr;
  }

  set type(newType: string | null) { this._type = newType || undefined; }
  set theme(newTheme: string | null) { this._theme = newTheme || undefined; }

  set youtubeVideoId(newId: string) {
    if (!newId?.trim()) {
      throw new Error("youtubeVideoId não pode ser vazio!");
    }
    this._youtubeVideoId = newId.trim();
  }

  set description(newDescription: string | null) { this._description = newDescription || undefined; }
  set thumbnailUrl(newUrl: string | null) { this._thumbnailUrl = newUrl || undefined; }
  set publishedAt(newDate: Date | null) { this._publishedAt = newDate || undefined; }
  set channelTitle(newChannel: string | null) { this._channelTitle = newChannel || undefined; }
  set tags(newTags: string | null) { this._tags = newTags || undefined; }
  set status(newStatus: string) { this._status = newStatus; }
  set updatedAt(newUpdatedAt: Date) { this._updatedAt = newUpdatedAt; }

  //------ Métodos para exposição de dados ----------
  public toPublicData(): IVideoPublicData {
    return {
      id: this._id,
      title: this._title,
      cefr: this._cefr,
      type: this._type,
      theme: this._theme,
      youtubeVideoId: this._youtubeVideoId,
      description: this._description,
      thumbnailUrl: this._thumbnailUrl,
      publishedAt: this._publishedAt,
      channelTitle: this._channelTitle,
      tags: this._tags,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public toPersistenceForCreate(): IVideoPersistence {
    return {
      id: this._id,
      title: this._title,
      cefr: this._cefr,
      type: this._type,
      theme: this._theme,
      youtubeVideoId: this._youtubeVideoId,
      description: this._description,
      thumbnailUrl: this._thumbnailUrl,
      publishedAt: this._publishedAt,
      channelTitle: this._channelTitle,
      tags: this._tags,
      status: this._status,
      createdAt: this._createdAt,
    };
  }

  public toPersistenceForUpdate(): IVideoPersistence {
    return {
      id: this._id,
      title: this._title,
      cefr: this._cefr,
      type: this._type,
      theme: this._theme,
      youtubeVideoId: this._youtubeVideoId,
      description: this._description,
      thumbnailUrl: this._thumbnailUrl,
      publishedAt: this._publishedAt,
      channelTitle: this._channelTitle,
      tags: this._tags,
      status: this._status,
      updatedAt: this._updatedAt,
    };
  }

  public toPersistence(): IVideo {
    return {
      id: this._id,
      title: this._title,
      cefr: this._cefr,
      type: this._type,
      theme: this._theme,
      youtubeVideoId: this._youtubeVideoId,
      description: this._description,
      thumbnailUrl: this._thumbnailUrl,
      publishedAt: this._publishedAt,
      channelTitle: this._channelTitle,
      tags: this._tags,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      userVideoProgress: this._userVideoProgress,
    };
  }
  //------ ---------------------------- ------------

  private validateRequiredFields(data: IVideo): void {
    if (!data.id) throw new Error("ID não pode ser vazio!");
    if (!data.title) throw new Error("Título não pode ser vazio!");
    if (!data.youtubeVideoId) throw new Error("youtubeVideoId não pode ser vazio!");
    if (!data.cefr) throw new Error("CEFR não pode ser vazio!");
    if (!data.status) throw new Error("Status não pode ser vazio!");
  }

  private validateCefr(cefr: string): void {
    const validCefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    if (!validCefrLevels.includes(cefr)) {
      throw new Error("CEFR deve ser um nível válido (A1, A2, B1, B2, C1, C2)!");
    }
  }
}