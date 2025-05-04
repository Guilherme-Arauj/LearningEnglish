import { IUserQuestionProgress } from './UserQuestionProgress';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  cefr: string;
  privilege: string;
  userQuestionProgress?: IUserQuestionProgress[];
}

export class User implements IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    cefr: string;
    privilege: string;
    userQuestionProgress?: IUserQuestionProgress[];
  
    constructor(data: IUser) {
      this.id = data.id;
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.cefr = data.cefr;
      this.privilege = data.privilege;
      this.userQuestionProgress = data.userQuestionProgress;
    }
  }