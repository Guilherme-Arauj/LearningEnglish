import { Video } from "../../../domain/entities/Video";

export interface IVideoRepository {
    create(video: Video): Promise <Video>;
    update(video: Video): Promise<Video>;
    getAllVideos(): Promise<Video[]>;
    getVideoById(id: string): Promise<Video>;
    delete(id: string): Promise<Video>;
    findVideoByYoutubeId(youtubeId: string): Promise<Video | null>;
}