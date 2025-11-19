import { IPrismaConfig } from "../database/IPrismaConfig";
import { PrismaConfig } from "../database/PrismaConfig";
import { IUserVideoProgressRepository } from "../../application/services/repositories/IUserVideoProgressRepository";
import { UserVideoProgressRepository } from "../../application/services/repositories/UserVideoProgressRepository";
import { UserVideoProgressService } from "../../application/services/UserVideoProgressService";
import { UserVideoProgressController } from "../web/controllers/UserVideoProgressController";

export function UserVideoProgressFactory(): UserVideoProgressController {
    const prismaConfig: IPrismaConfig = new PrismaConfig();
    const userVideoProgressRepository: IUserVideoProgressRepository = new UserVideoProgressRepository(prismaConfig);

    const videoService = new UserVideoProgressService(
        userVideoProgressRepository,
    )

    return new UserVideoProgressController(
        videoService
    );
}