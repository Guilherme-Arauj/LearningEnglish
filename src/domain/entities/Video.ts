export interface IVideo {
  id: string;
  youtubeVideoId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: Date;
  channelTitle?: string;
  tags?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVideoPublicData {
  id: string;
  youtubeVideoId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: Date;
  channelTitle?: string;
  tags?: string; 
}

export class Video implements IVideo {
  private _id: string;
  private _youtubeVideoId: string;
  private _title: string;
  private _description?: string;
  private _thumbnailUrl?: string;
  private _publishedAt?: Date;
  private _channelTitle?: string;
  private _tags?: string; 
  private _status?: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(data: IVideo) {
    this.validateRequiredFields(data);

    this._id = data.id;
    this._youtubeVideoId = data.youtubeVideoId;
    this._title = data.title;
    this._description = data.description;
    this._thumbnailUrl = data.thumbnailUrl;
    this._publishedAt = data.publishedAt;
    this._channelTitle = data.channelTitle;
    this._tags = data.tags;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): string { return this._id; }
  get youtubeVideoId(): string { return this._youtubeVideoId; }
  get title(): string { return this._title; }
  get description(): string | undefined { return this._description; }
  get thumbnailUrl(): string | undefined { return this._thumbnailUrl; }
  get publishedAt(): Date | undefined { return this._publishedAt; }
  get channelTitle(): string | undefined { return this._channelTitle; }
  get tags(): string | undefined { return this._tags; }
  get status(): string | undefined { return this._status; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  set title(newTitle: string) {
    if (!newTitle?.trim()) {
      throw new Error("Título não pode ser vazio!");
    }
    this._title = newTitle.trim();
  }
  
  set youtubeVideoId(newId: string) {
    if (!newId?.trim()) {
      throw new Error("youtubeVideoId não pode ser vazio!");
    }
    this._youtubeVideoId = newId.trim();
  }
  
  set description(newDescription: string | null) { 
    this._description = newDescription || undefined; 
  }
  
  set thumbnailUrl(newUrl: string | null) { 
    this._thumbnailUrl = newUrl || undefined; 
  }
  
  set publishedAt(newDate: Date | null) { 
    this._publishedAt = newDate || undefined; 
  }
  
  set channelTitle(newChannel: string | null) { 
    this._channelTitle = newChannel || undefined; 
  }
  
  set tags(newTags: string | null) {
    this._tags = newTags || undefined; 
  }

  set status(newStatus: string) {
    this._status = newStatus;
  }

  set updatedAt(newUpdatedAt: Date) {
    this._updatedAt = newUpdatedAt;
  }

  //------ Métodos para exposição de dados ----------
  public toPublicData(): IVideoPublicData {
    return {
      id: this._id,
      youtubeVideoId: this._youtubeVideoId,
      title: this._title,
      description: this._description,
      thumbnailUrl: this._thumbnailUrl,
      publishedAt: this._publishedAt,
      channelTitle: this._channelTitle,
      tags: this._tags,
    };
  }

  public toPersistenceForCreate(): IVideo {
    return {
      id: this._id,
      youtubeVideoId: this._youtubeVideoId,
      title: this._title,
      description: this._description,
      thumbnailUrl: this._thumbnailUrl,
      publishedAt: this._publishedAt,
      channelTitle: this._channelTitle,
      tags: this._tags,
      status: this._status,
      createdAt: this._createdAt,
    };
  }

    public toPersistenceForUpdate(): IVideo {
    return {
      id: this._id,
      youtubeVideoId: this._youtubeVideoId,
      title: this._title,
      description: this._description,
      thumbnailUrl: this._thumbnailUrl,
      publishedAt: this._publishedAt,
      channelTitle: this._channelTitle,
      tags: this._tags,
      status: this._status,
      updatedAt: this._updatedAt
    };
  }
  //------ ---------------------------- ------------

  private validateRequiredFields(data: IVideo): void {
    if (!data.id) throw new Error("ID não pode ser vazio!");
    if (!data.youtubeVideoId) throw new Error("youtubeVideoId não pode ser vazio!");
    if (!data.title) throw new Error("Título não pode ser vazio!");
  }
}