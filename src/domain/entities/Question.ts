import { IUserQuestionProgress } from "./UserQuestionProgress";

export interface IQuestion {
    id: string;
    title: string;
    cefr?: string;
    type?: string;
    theme?: string;
    optionA?: string;
    optionB?: string;
    optionC?: string;
    response?: string;
    userQuestionProgress?: IUserQuestionProgress;
}

export class Question implements IQuestion {
    id: string;
    title: string;
    cefr?: string;
    type?: string;
    theme?: string;
    optionA?: string;
    optionB?: string;
    optionC?: string;
    response?: string;
    userQuestionProgress?: IUserQuestionProgress;
  
    constructor(data: IQuestion) {
      this.id = data.id;
      this.title = data.title;
      this.cefr = data.cefr;
      this.type = data.type;
      this.theme = data.theme;
      this.optionA = data.optionA;
      this.optionB = data.optionB;
      this.optionC = data.optionC;
      this.response = data.response;
      this.userQuestionProgress = data.userQuestionProgress;
    }
}