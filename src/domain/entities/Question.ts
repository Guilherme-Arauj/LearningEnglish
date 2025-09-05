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
  userQuestionProgress?: IUserQuestionProgress[];
}

export interface IQuestionPublicData {
  id: string;
  title: string;
  cefr?: string;
  type?: string;
  theme?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  response?: string;
}

export class Question implements IQuestion {
  private _id: string;
  private _title: string;
  private _cefr?: string;
  private _type?: string;
  private _theme?: string;
  private _optionA?: string;
  private _optionB?: string;
  private _optionC?: string;
  private _response?: string;
  private _userQuestionProgress?: IUserQuestionProgress[];

  constructor(data: IQuestion) {
    this.validateRequiredFields(data);

    this._id = data.id;
    this._title = data.title;
    this._cefr = data.cefr;
    this._type = data.type;
    this._theme = data.theme;
    this._optionA = data.optionA;
    this._optionB = data.optionB;
    this._optionC = data.optionC;
    this._response = data.response;
    this._userQuestionProgress = data.userQuestionProgress;
  }

  get id(): string {return this._id;}
  get title(): string {return this._title;}
  get cefr(): string | undefined {return this._cefr;}
  get type(): string | undefined {return this._type;}
  get theme(): string | undefined {return this._theme;}
  get optionA(): string | undefined {return this._optionA;}
  get optionB(): string | undefined {return this._optionB;}
  get optionC(): string | undefined {return this._optionC;}
  get response(): string | undefined {return this._response;}
  get userQuestionProgress(): IUserQuestionProgress[] | undefined {return this._userQuestionProgress;}

  set title(newTitle: string) {
    if (!newTitle?.trim()) {
      throw new Error("Título não pode ser vazio!");
    }
    this._title = newTitle.trim();
  }
  set cefr(newCefr: string | null) {this._cefr = newCefr || undefined;}
  set type(newType: string | null) {this._type = newType || undefined;}
  set theme(newTheme: string | null) {this._theme = newTheme || undefined;}
  set optionA(newOptionA: string | null) {this._optionA = newOptionA || undefined;}
  set optionB(newOptionB: string | null) {this._optionB = newOptionB || undefined;}
  set optionC(newOptionC: string | null) {this._optionC = newOptionC || undefined;}
  set response(newResponse: string | null) {this._response = newResponse || undefined;}

  //------ Métodos para exposição de dados ----------
  public toPublicData(): IQuestionPublicData {
    return {
      id: this._id,
      title: this._title,
      cefr: this._cefr,
      type: this._type,
      theme: this._theme,
      optionA: this._optionA,
      optionB: this._optionB,
      optionC: this._optionC,
      response: this._response,
    };
  }

  public toPersistence(): IQuestion {
    return {
      id: this._id,
      title: this._title,
      cefr: this._cefr,
      type: this._type,
      theme: this._theme,
      optionA: this._optionA,
      optionB: this._optionB,
      optionC: this._optionC,
      response: this._response,
      userQuestionProgress: this._userQuestionProgress,
    };
  }
  //------ ---------------------------- ------------

  public isCorrectAnswer(answer: string): boolean {
    if (!this._response) {
      throw new Error("Questão não possui resposta definida");
    }
    return answer.toUpperCase().trim() === this._response.toUpperCase().trim();
  }

  public getCorrectAnswer() {
    if (!this._response) {
      throw new Error("Questão não possui resposta definida");
    }
    switch (this._response.toUpperCase()) {
      case 'A':
        return this._optionA;
      case 'B':
        return this._optionB;
      case 'C':
        return this._optionC;
      default:
        return this._response;
    }
  }

  private validateRequiredFields(data: IQuestion): void {
    if (!data.id) throw new Error("ID não pode ser vazio!");
    if (!data.title) throw new Error("Título não pode ser vazio!");
    if (data.response && !['A', 'B', 'C'].includes(data.response.toUpperCase())) {
      throw new Error("Resposta deve ser A, B ou C");
    }
  }
}
