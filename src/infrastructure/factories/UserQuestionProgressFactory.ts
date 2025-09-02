import { QuestionRepository } from "../../application/services/repositories/QuestionRepository";
import { QuestionController } from "../web/controllers/QuestionController";
import { IQuestionRepository } from "../../application/services/repositories/IQuestionRepository";
import { IUuidConfig } from "../utils/uuid/IUuidConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";
import { IPrismaConfig } from "../database/IPrismaConfig";
import { PrismaConfig } from "../database/PrismaConfig";
import { IUserQuestionProgressRepository } from "../../application/services/repositories/IUserQuestionProgressRepository";
import { UserQuestionProgressRepository } from "../../application/services/repositories/UserQuestionProgressRepository";
import { QuestionService } from "../../application/services/QuestionService";
import { UserQuestionProgressService } from "../../application/services/UserQuestionProgressService";
import { UserQuestionProgressController } from "../web/controllers/UserQuestionProgressController";

export function UserQuestionProgressFactory(): UserQuestionProgressController {
    const prismaConfig: IPrismaConfig = new PrismaConfig();
    const userQuestionProgressRepository: IUserQuestionProgressRepository = new UserQuestionProgressRepository(prismaConfig);

    const questionService = new UserQuestionProgressService(
        userQuestionProgressRepository,
    )

    return new UserQuestionProgressController(
        questionService
    );
}