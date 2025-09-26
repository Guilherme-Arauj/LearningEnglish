import { Question } from "../../../domain/entities/Question";


export class QuestionResponseDTO {
    public id: string;
    public title: string;
    public cefr?: string | null;
    public type?: string | null;
    public theme?: string | null;
    public optionA?: string | null;
    public optionB?: string | null;
    public optionC?: string | null;
    public response?: string | null;
  
    constructor(
      id: string,
      title: string,
      cefr?: string | null,
      type?: string | null,
      theme?: string | null,
      optionA?: string | null,
      optionB?: string | null,
      optionC?: string | null,
      response?: string | null
    ) {
      this.id = id;
      this.title = title;
      this.cefr = cefr;
      this.type = type;
      this.theme = theme;
      this.optionA = optionA;
      this.optionB = optionB;
      this.optionC = optionC;
      this.response = response;
    }

    static fromQuestion(question: Question): QuestionResponseDTO {
      const publicData = question.toPublicData();
      return new QuestionResponseDTO(
        publicData.id,
        publicData.title,
        publicData.cefr,
        publicData.type,
        publicData.theme,
        publicData.optionA,
        publicData.optionB,
        publicData.optionC,
        publicData.response
      )
    }
  }