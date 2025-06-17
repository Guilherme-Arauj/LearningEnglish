import { Question } from "../../domain/entities/Question";
import { IQuestionRepository } from "./repositories/IQuestionRepository";
import { QuestionDTO } from "../dto/QuestionDTO";
import { IUuidConfig } from "../../infrastructure/utils/uuid/IUuidConfig";
import { QuestionResponseDTO } from "../dto/QuestionResponseDTO";

export class CreateQuestion {
  constructor(
    private questionRepository: IQuestionRepository,
    private uuidConfig: IUuidConfig
  ) {}

  public async execute(dto: QuestionDTO): Promise<QuestionResponseDTO> {

    const id = await this.uuidConfig.generateQuestionId();

    const question = new Question({
        id: id,
        title: dto.title,
        cefr: dto.cefr ?? undefined,
        type: dto.type ?? undefined,
        theme: dto.theme ?? undefined,
        optionA: dto.optionA ?? undefined,
        optionB: dto.optionB ?? undefined,
        optionC: dto.optionC ?? undefined,
        response: dto.response ?? undefined
      });

    const savedQuestion = await this.questionRepository.create(question);

    return new QuestionResponseDTO(
      savedQuestion.id,
      savedQuestion.title,
      savedQuestion.cefr,
      savedQuestion.type,
      savedQuestion.theme,
      savedQuestion.optionA,
      savedQuestion.optionB,
      savedQuestion.optionC,
      savedQuestion.response
    );
  }
}