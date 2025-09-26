import {
  IUserQuestionProgressPublicData,
  UserQuestionProgress,
} from "../../../domain/entities/UserQuestionProgress";

export class UserQuestionProgressResponseDTO {
  public id: string;
  public userId?: string;
  public questionId?: string;
  public status?: boolean;
  public chosenOption?: string;
  public question?: {
    title: string;
    theme: string;
    cefr: string;
    type: string;
  } | null;

  constructor(
    id: string,
    userId?: string,
    questionId?: string,
    status?: boolean,
    chosenOption?: string,
    question?: {
      title: string;
      theme: string;
      cefr: string;
      type: string;
    } | null
  ) {
    this.id = id;
    this.userId = userId;
    this.questionId = questionId;
    this.status = status;
    this.chosenOption = chosenOption;
    this.question = question;
  }

  static fromUserQuestionProgress(
    userQuestionProgress: UserQuestionProgress
  ): UserQuestionProgressResponseDTO {
    const publicData = userQuestionProgress.toPublicData();
    return new UserQuestionProgressResponseDTO(
      publicData.id,
      publicData.userId,
      publicData.questionId,
      publicData.status,
      publicData.chosenOption,
      publicData.question
        ? {
            title: publicData.question.title || "",
            theme: publicData.question.theme || "",
            cefr: publicData.question.cefr || "",
            type: publicData.question.type || "",
          }
        : null
    );
  }
}
