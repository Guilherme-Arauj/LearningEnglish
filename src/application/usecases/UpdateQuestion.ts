import { Question } from "../../domain/entities/Question";
import { IQuestionRepository } from "./repositories/IQuestionRepository";
import { QuestionUpdateDTO } from "../dto/QuestionUpdateDTO";
import { QuestionResponseDTO } from "../dto/QuestionResponseDTO";

export class UpdateQuestion {
  constructor(
    private questionRepository: IQuestionRepository
  ) {}

  public async execute(dto: QuestionUpdateDTO): Promise<QuestionResponseDTO> {

    const validatedQuestion = await this.questionRepository.findQuestionById(dto.id);
    if (!validatedQuestion) throw new Error("Questão não encontrada");

    const question = new Question({
      id: validatedQuestion.id,
      title: dto.title ?? validatedQuestion.title,
      cefr: dto.cefr ?? validatedQuestion.cefr,
      type: dto.type ?? validatedQuestion.type,
      theme: dto.theme ?? validatedQuestion.theme,
      optionA: dto.optionA ?? validatedQuestion.optionA,
      optionB: dto.optionB ?? validatedQuestion.optionB,
      optionC: dto.optionC ?? validatedQuestion.optionC,
      response: dto.response ?? validatedQuestion.response,
      userQuestionProgress: validatedQuestion.userQuestionProgress 
    });
    const updatedQuestion = await this.questionRepository.update(question);

    return new QuestionResponseDTO(
      updatedQuestion.id,
      updatedQuestion.title,
      updatedQuestion.cefr,
      updatedQuestion.type,
      updatedQuestion.theme,
      updatedQuestion.optionA,
      updatedQuestion.optionB,
      updatedQuestion.optionC,
      updatedQuestion.response
    );
  }
}