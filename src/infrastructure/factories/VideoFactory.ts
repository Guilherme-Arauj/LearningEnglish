import { VideoController } from "../web/controllers/VideoController";
import { VideoService } from "../../application/services/VideoService";
import { IVideoRepository } from "../../application/services/repositories/IVideoRepository";
import { VideoRepository } from "../../application/services/repositories/VideoRepository";
import { PrismaConfig } from "../database/PrismaConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";
import { IUserRepository } from "../../application/services/repositories/IUserRepository";
import { UserRepository } from "../../application/services/repositories/UserRepository";
import { IUserVideoProgressRepository } from "../../application/services/repositories/IUserVideoProgressRepository";
import { IUserQuestionProgressRepository } from "../../application/services/repositories/IUserQuestionProgressRepository";
import { UserVideoProgressRepository } from "../../application/services/repositories/UserVideoProgressRepository";
import { UserQuestionProgressRepository } from "../../application/services/repositories/UserQuestionProgressRepository";

export function VideoFactory(): VideoController {
  const prismaConfig = new PrismaConfig();
  const videoRepository: VideoRepository = new VideoRepository(prismaConfig);
  const userRepository: IUserRepository = new UserRepository(prismaConfig);
  const userVideoProgressRepository: IUserVideoProgressRepository = new UserVideoProgressRepository(prismaConfig);
  const userQuestionProgressRepository: IUserQuestionProgressRepository = new UserQuestionProgressRepository(prismaConfig);
  const uuidConfig = new UuidConfig();

  const videoService = new VideoService(videoRepository, userRepository, userVideoProgressRepository, userQuestionProgressRepository, uuidConfig);

  return new VideoController(videoService);
}
