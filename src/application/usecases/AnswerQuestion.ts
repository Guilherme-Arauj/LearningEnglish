import { AnswerQuestionDTO } from "../dto/AnswerQuestionDTO";
import { IQuestionRepository } from "./repositories/IQuestionRepository";
import { IUserQuestionProgressRepository } from "./repositories/IUserQuestionProgressRepository";
import { UserQuestionProgress } from "../../domain/entities/UserQuestionProgress";
import { IUuidConfig } from "../../infrastructure/utils/uuid/IUuidConfig";

export class AnswerQuestion {
  constructor(
    private questionRepository: IQuestionRepository,
    private userQuestionProgressRepository: IUserQuestionProgressRepository,
    private uuidConfig: IUuidConfig
  ) {}

  public async execute(dto: AnswerQuestionDTO): Promise<{ correct: boolean; correctAnswer?: string }> {
    const question = await this.questionRepository.findQuestionById(dto.questionId);
    if (!question) {
      throw new Error("Questão não encontrada");
    }

    if (!question.response) {
      throw new Error("Questão não possui resposta definida");
    }

    const isCorrect = dto.answer.toUpperCase().trim() === question.response.toUpperCase().trim();

    let correctAnswerText;
    if (!isCorrect) {
      switch (question.response.toUpperCase()) {
        case 'A':
          correctAnswerText = question.optionA;
          break;
        case 'B':
          correctAnswerText = question.optionB;
          break;
        case 'C':
          correctAnswerText = question.optionC;
          break;
        default:
          correctAnswerText = question.response;
      }
    }

    const existingProgress = await this.userQuestionProgressRepository.findByUserAndQuestion(dto.userId, dto.questionId);

    if (existingProgress) {
      existingProgress.status = isCorrect;
      existingProgress.chosenOption = dto.answer.toUpperCase();
      await this.userQuestionProgressRepository.update(existingProgress);
    } else {
      const progressId = await this.uuidConfig.generateUserQuestionProgressId();
      
      const userQuestionProgress = new UserQuestionProgress({
        id: progressId,
        userId: dto.userId,
        questionId: dto.questionId,
        status: isCorrect,
        chosenOption: dto.answer.toUpperCase()
      });

      await this.userQuestionProgressRepository.create(userQuestionProgress);
    }

    return {
      correct: isCorrect,
      correctAnswer: correctAnswerText
    };
  }
}