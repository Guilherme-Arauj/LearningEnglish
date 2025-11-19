import { UserVideoProgress } from "../../../domain/entities/UserVideoProgress";

export interface IUserVideoProgressRepository {
  create(userVideoProgress: UserVideoProgress): Promise<UserVideoProgress>;
  findByUserAndVideo(userId: string, VideoId: string): Promise<UserVideoProgress | null>;
  update(userVideoProgress: UserVideoProgress): Promise<UserVideoProgress>;
  findByUserIdWithVideos(userId: string): Promise<UserVideoProgress[]>;
  countByUserId(userId: string): Promise<number>;
}