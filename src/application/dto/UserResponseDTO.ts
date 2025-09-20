import { User } from "../../domain/entities/User";

export class UserResponseDTO {
  public id: string;
  public name: string;
  public email: string;
  public privilege: string;
  public cefr: string;
  public firstAccess: boolean;
  public timeline: number;
  public studyTimeSeconds?: number;
  public token?: string;

  constructor(
    id: string,
    name: string,
    email: string,
    privilege: string,
    cefr: string,
    firstAccess: boolean,
    timeline: number,
    studyTimeSeconds?: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.privilege = privilege;
    this.cefr = cefr;
    this.studyTimeSeconds = studyTimeSeconds;
    this.firstAccess = firstAccess;
    this.timeline = timeline;
  }

  static fromUser(user: User): UserResponseDTO {
    const publicData = user.toPublicData();
    return new UserResponseDTO(
      publicData.id,
      publicData.name,
      publicData.email,
      publicData.privilege,
      publicData.cefr,
      publicData.firstAccess,
      publicData.timeline,
      publicData.timeSpentSeconds
    );
  }

  static fromUserWithToken(user: User, token: string): UserResponseDTO {
    const dto = UserResponseDTO.fromUser(user);
    dto.token = token;
    return dto;
  }
}