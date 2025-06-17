import { AnswerQuestionDTO } from "../dto/AnswerQuestionDTO";
import { IQuestionRepository } from "./repositories/IQuestionRepository";

export class AnswerQuestion {
  constructor(
    private questionRepository: IQuestionRepository,
  ) {}

  public async execute(dto: AnswerQuestionDTO): Promise<{ correct: boolean; correctAnswer?: string }> {
    const question = await this.questionRepository.findQuestionById(dto.id);
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

    return {
      correct: isCorrect,
      correctAnswer: correctAnswerText
    };
  }
}