import {
  IUserQuestionProgressPublicData,
  UserQuestionProgress,
} from "../../../domain/entities/UserQuestionProgress";
import { IQuestion } from "../../../domain/entities/Question";

export class UserQuestionProgressResponseDTO {
  public id: string;
  public userId?: string;
  public questionId?: string;
  public status?: boolean;
  public chosenOption?: string;

  public question?: IQuestion | null;

  constructor(
    id: string,
    userId?: string,
    questionId?: string,
    status?: boolean,
    chosenOption?: string,
    question?: IQuestion | null
  ) {
    this.id = id;
    this.userId = userId;
    this.questionId = questionId;
    this.status = status;
    this.chosenOption = chosenOption;
    this.question = question ?? null;
  }

  static fromUserQuestionProgress(
    userQuestionProgress: UserQuestionProgress
  ): UserQuestionProgressResponseDTO {
    const publicData: IUserQuestionProgressPublicData =
      userQuestionProgress.toPublicData();

    return new UserQuestionProgressResponseDTO(
      publicData.id,
      publicData.userId,
      publicData.questionId,
      publicData.status,
      publicData.chosenOption,
      publicData.question ?? null
    );
  }
}
