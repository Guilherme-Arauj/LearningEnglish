import { UserQuestionProgress } from "../../../domain/entities/UserQuestionProgress";

export interface IUserQuestionProgressRepository {
  create(userQuestionProgress: UserQuestionProgress): Promise<UserQuestionProgress>;
  findByUserAndQuestion(userId: string, questionId: string): Promise<UserQuestionProgress | null>;
  update(userQuestionProgress: UserQuestionProgress): Promise<UserQuestionProgress>;
}