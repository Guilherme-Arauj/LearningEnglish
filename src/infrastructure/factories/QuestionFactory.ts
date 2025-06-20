import { QuestionRepository } from "../../application/usecases/repositories/QuestionRepository";
import { CreateQuestion } from "../../application/usecases/CreateQuestion";
import { QuestionController } from "../web/controllers/QuestionController";
import { IQuestionRepository } from "../../application/usecases/repositories/IQuestionRepository";
import { IUuidConfig } from "../utils/uuid/IUuidConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";
import { IPrismaConfig } from "../database/IPrismaConfig";
import { PrismaConfig } from "../database/PrismaConfig";
import { UpdateQuestion } from "../../application/usecases/UpdateQuestion";
import { GetAllQuestions } from "../../application/usecases/GetAllQuestions";
import { DeleteQuestion } from "../../application/usecases/DeleteQuestion";
import { AnswerQuestion } from "../../application/usecases/AnswerQuestion";
import { IUserQuestionProgressRepository } from "../../application/usecases/repositories/IUserQuestionProgressRepository";
import { UserQuestionProgressRepository } from "../../application/usecases/repositories/UserQuestionProgressRepository";
import { TrackProgress } from "../../application/usecases/TrackProgress";

export function QuestionFactory(): QuestionController {
    const prismaConfig: IPrismaConfig = new PrismaConfig();
    const questionRepository: IQuestionRepository = new QuestionRepository(prismaConfig);
    const uuidConfig: IUuidConfig = new UuidConfig();
    const userQuestionProgressRepository: IUserQuestionProgressRepository = new UserQuestionProgressRepository(prismaConfig);

    const createQuestionUseCase = new CreateQuestion(
        questionRepository,
        uuidConfig
    );

    const updateQuestionUseCase = new UpdateQuestion(
        questionRepository
    );

    const getAllQuestionsUseCase = new GetAllQuestions(
        questionRepository
    );

    const deleteQuestionUseCase = new DeleteQuestion(
        questionRepository
    );

    const answerQuestionUseCase = new AnswerQuestion(
        questionRepository,
        userQuestionProgressRepository,
        uuidConfig
    );

    const trackProgressUseCase = new TrackProgress(
        userQuestionProgressRepository
    );

    return new QuestionController(
        createQuestionUseCase, 
        updateQuestionUseCase, 
        getAllQuestionsUseCase, 
        deleteQuestionUseCase,
        answerQuestionUseCase,
        trackProgressUseCase
    );
}