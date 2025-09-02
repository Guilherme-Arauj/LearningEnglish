import { IUserQuestionProgress } from "./UserQuestionProgress";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  cefr: string;
  privilege: string;
  timeSpentSeconds?: number;
  timeline: number;
  firstAccess: boolean;
  userQuestionProgress?: IUserQuestionProgress[];
}

export interface IUserPublicData {
  id: string;
  name: string;
  email: string;
  cefr: string;
  privilege: string;
  timeline: number;
  firstAccess: boolean;
  timeSpentSeconds: number;
  userQuestionProgress?: IUserQuestionProgress[];
}

export class User implements IUser {
  private _id: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _cefr: string;
  private _privilege: string;
  private _timeSpentSeconds: number;
  private _timeline: number;
  private _firstAccess: boolean;
  private _userQuestionProgress?: IUserQuestionProgress[];

  constructor(data: IUser) {
    this.validateRequiredFields(data);
    this.validateEmail(data.email);
    this.validateCefr(data.cefr);
    this.validatePrivilege(data.privilege);

    this._id = data.id;
    this._name = data.name.trim();
    this._email = data.email.toLowerCase().trim();
    this._password = data.password;
    this._cefr = data.cefr;
    this._privilege = data.privilege;
    this._timeSpentSeconds = data.timeSpentSeconds ?? 0;
    this._timeline = data.timeline
    this._firstAccess = data.firstAccess
    this._userQuestionProgress = data.userQuestionProgress;
  }

  get id(): string {return this._id;}
  get name(): string {return this._name;}
  get email(): string {return this._email;}
  get password(): string {return this._password;}
  get cefr(): string {return this._cefr;}
  get privilege(): string {return this._privilege;}
  get timeSpentSeconds(): number {return this._timeSpentSeconds;}
  get userQuestionProgress(): IUserQuestionProgress[] | undefined {return this._userQuestionProgress;}
  get timeline(): number {return this._timeline;}
  get firstAccess(): boolean {return this._firstAccess;}

  public setHashedPassword(hashedPassword: string): void {
    if (!hashedPassword) {
      throw new Error("Senha hasheada não pode ser vazia!");
    }
    this._password = hashedPassword;
  }

  public updateFirstAccess(newAccess: boolean): void {
    if (newAccess !== false) {
      throw new Error("Acesso deve ser atualizado apenas para false!");
    }
    this._firstAccess = newAccess;
  }

  public updateName(newName: string): void {
    if (!newName?.trim()) {
      throw new Error("Nome não pode ser vazio!");
    }
    this._name = newName.trim();
  }

  public updateEmail(newEmail: string): void {
    this.validateEmail(newEmail);
    this._email = newEmail.toLowerCase().trim();
  }

  public updateCefr(newCefr: string): void {
    this.validateCefr(newCefr);
    this._cefr = newCefr;
  }

  public updatePrivilege(newPrivilege: string): void {
    this.validatePrivilege(newPrivilege);
    this._privilege = newPrivilege;
  }

  public addStudyTime(seconds: number): void {
    if (seconds <= 0) {
      throw new Error("Tempo deve ser positivo");
    }
    this._timeSpentSeconds += seconds;
  }

  public addQuestionProgress(progress: IUserQuestionProgress): void {
    if (!this._userQuestionProgress) {
      this._userQuestionProgress = [];
    }
    this._userQuestionProgress.push(progress);
  }

  public clearQuestionProgress(): void {
    this._userQuestionProgress = [];
  }

  public static isStrongPassword(password: string): boolean {
    if (!password) return false;

    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  //------ Métodos para exposição de dados --------
  public toPublicData(): IUserPublicData {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      cefr: this._cefr,
      privilege: this._privilege,
      timeline: this._timeline,
      firstAccess: this._firstAccess,
      timeSpentSeconds: this._timeSpentSeconds,
    };
  }

  public toPersistence(): IUser {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      password: this._password,
      cefr: this._cefr,
      privilege: this._privilege,
      timeSpentSeconds: this._timeSpentSeconds,
      timeline: this._timeline,
      firstAccess: this._firstAccess,
    };
  }
  //------ --------------------------------- --------

  // --------- Métodos de validação -----------
  private validateRequiredFields(data: IUser): void {
    if (!data.id) throw new Error("ID não pode ser vazio!");
    if (!data.name?.trim()) throw new Error("Nome não pode ser vazio!");
    if (!data.email?.trim()) throw new Error("Email não pode ser vazio!");
    if (!data.privilege) throw new Error("Privilege não pode ser vazio!");
    if (!data.cefr) throw new Error("CEFR não pode ser vazio!");
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email deve ter um formato válido!");
    }
  }

  private validateCefr(cefr: string): void {
    const validCefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    if (!validCefrLevels.includes(cefr)) {
      throw new Error(
        "CEFR deve ser um nível válido (A1, A2, B1, B2, C1, C2)!"
      );
    }
  }

  private validatePrivilege(privilege: string): void {
    const validPrivileges = ["student", "admin"];
    if (!validPrivileges.includes(privilege)) {
      throw new Error("Privilege deve ser 'student' ou 'admin'!");
    }
  }
  // --------- -------------------- -----------
}
