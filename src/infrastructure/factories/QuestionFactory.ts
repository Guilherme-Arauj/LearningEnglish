import { QuestionRepository } from "../../application/usecases/repositories/QuestionRepository";
import { CreateQuestion } from "../../application/usecases/CreateQuestion";
import { QuestionController } from "../web/controllers/QuestionController";
import { IQuestionRepository } from "../../application/usecases/repositories/IQuestionRepository";
import { IUuidConfig } from "../utils/uuid/IUuidConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";
import { IPrismaConfig } from "../database/IPrismaConfig";
import { PrismaConfig } from "../database/PrismaConfig";
import { UpdateQuestion } from "../../application/usecases/UpdateQuestion";

export function QuestionFactory(): QuestionController {
    const prismaConfig: IPrismaConfig = new PrismaConfig();
    const questionRepository: IQuestionRepository = new QuestionRepository(prismaConfig);
    const uuidConfig: IUuidConfig = new UuidConfig();

    const createQuestionUseCase = new CreateQuestion(
        questionRepository,
        uuidConfig
    );

    const updateQuestionUseCase = new UpdateQuestion(
        questionRepository
    );

    return new QuestionController(createQuestionUseCase, updateQuestionUseCase);
}