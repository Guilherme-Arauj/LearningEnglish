import { IQuestion } from "./Question";
import { IUser } from "./User";

export interface IUserQuestionProgress {
    id: string;
    userId?: string;
    questionId?: string;
    status?: boolean;
    chosenOption?: string;
    user?: IUser;
    question?: IQuestion;
}

  export class UserQuestionProgress implements IUserQuestionProgress {
    id: string;
    userId?: string;
    questionId?: string;
    status?: boolean;
    chosenOption?: string;
    user?: IUser;
    question?: IQuestion;
  
    constructor(data: IUserQuestionProgress) {
      this.id = data.id;
      this.userId = data.userId;
      this.questionId = data.questionId;
      this.status = data.status;
      this.chosenOption = data.chosenOption;
      this.user = data.user;
      this.question = data.question;
    }
} 