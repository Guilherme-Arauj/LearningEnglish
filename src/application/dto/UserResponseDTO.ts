export class UserResponseDTO {
  public id: string;
  public name: string;
  public email: string;
  public privilege: string;
  public cefr: string;
  public studyTimeSeconds?: number;

  constructor(
    id: string,
    name: string,
    email: string,
    privilege: string,
    cefr: string,
    studyTimeSeconds?: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.privilege = privilege;
    this.cefr = cefr;
    this.studyTimeSeconds = studyTimeSeconds;
  }
}