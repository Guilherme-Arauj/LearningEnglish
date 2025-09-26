import { VideoController } from "../web/controllers/VideoController";
import { VideoService } from "../../application/services/VideoService";
import { IVideoRepository } from "../../application/services/repositories/IVideoRepository";
import { VideoRepository } from "../../application/services/repositories/VideoRepository";
import { PrismaConfig } from "../database/PrismaConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";

export function VideoFactory(): VideoController {
  const prismaConfig = new PrismaConfig();
  const videoRepository: VideoRepository = new VideoRepository(prismaConfig);
  const uuidConfig = new UuidConfig();

  const videoService = new VideoService(videoRepository, uuidConfig);

  return new VideoController(videoService);
}
