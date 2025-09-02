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
export interface IUserQuestionProgressPublicData {
  id: string;
  userId?: string;
  questionId?: string;
  status?: boolean;
  chosenOption?: string;
  question?: IQuestion;
}

export interface IUserQuestionPersistence {
  id: string;
  userId?: string;
  questionId?: string;
  status?: boolean;
  chosenOption?: string;
}

export class UserQuestionProgress implements IUserQuestionProgress {
  private _id: string;
  private _userId?: string;
  private _questionId?: string;
  private _status?: boolean;
  private _chosenOption?: string;
  private _user?: IUser;
  private _question?: IQuestion;

  constructor(data: IUserQuestionProgress) {
    this._id = data.id;
    this._userId = data.userId;
    this._questionId = data.questionId;
    this._status = data.status;
    this._chosenOption = data.chosenOption;
    this._user = data.user;
    this._question = data.question;
  }

  get id(): string {return this._id;}
  get userId(): string | undefined {return this._userId;}
  get questionId(): string | undefined {return this._questionId;}
  get status(): boolean | undefined {return this._status;}
  get chosenOption(): string | undefined {return this._chosenOption;}
  get user(): IUser | undefined {return this._user;}
  get question(): IQuestion | undefined {return this._question;}

  public updateProgress(status: boolean, chosenOption: string): void {
    this._status = status;
    this._chosenOption = chosenOption;
  }

  //------ Métodos para exposição de dados ----------
  public toPublicData(): IUserQuestionProgressPublicData {
    return {
      id: this._id,
      userId: this._userId,
      questionId: this._questionId,
      status: this._status,
      chosenOption: this._chosenOption,
      question: this._question
    };
  }

  public toPersistence(): IUserQuestionPersistence {
    return {
      id: this._id,
      userId: this._userId,
      questionId: this._questionId,
      status: this._status,
      chosenOption: this._chosenOption,
    };
  }
  //------ ---------------------------- ------------
}
