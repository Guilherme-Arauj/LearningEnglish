export class AddStudyTimeDTO {
  public userId: string;
  public timeToAdd: number;

  constructor(userId: string, timeToAdd: number) {
    this.userId = userId;
    this.timeToAdd = timeToAdd;
  }
}
