import { UserQuestionProgress } from "../../../domain/entities/UserQuestionProgress";
import { IUserQuestionProgressRepository } from "./IUserQuestionProgressRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";

export class UserQuestionProgressRepository
  implements IUserQuestionProgressRepository
{
  constructor(private prismaConfig: IPrismaConfig) {}

  private get prisma() {
    return this.prismaConfig.prisma;
  }

  public async create(
    userQuestionProgress: UserQuestionProgress
  ): Promise<UserQuestionProgress> {
    const created = await this.prisma.userQuestionProgress.create({
      data: userQuestionProgress.toPersistence(),
    });

    return this.mapToEntity(created);
  }

  public async findByUserAndQuestion(
    userId: string,
    questionId: string
  ): Promise<UserQuestionProgress | null> {
    const progress = await this.prisma.userQuestionProgress.findFirst({
      where: {
        userId: userId,
        questionId: questionId,
      },
    });

    if (!progress) return null;

    return this.mapToEntity(progress);
  }

  public async update(
    userQuestionProgress: UserQuestionProgress
  ): Promise<UserQuestionProgress> {
    const updated = await this.prisma.userQuestionProgress.update({
      where: { id: userQuestionProgress.id },
      data: userQuestionProgress.toPersistence(),
    });

    return this.mapToEntity(updated);
  }

  public async findByUserIdWithQuestions(
    userId: string
  ): Promise<UserQuestionProgress[]> {
    const progressWithQuestions =
      await this.prisma.userQuestionProgress.findMany({
        where: {
          userId: userId,
        },
        include: {
          question: true,
        },
        orderBy: {
          id: "desc",
        },
      });

    return progressWithQuestions.map((item) => this.mapToEntity(item));
  }

  public async countByUserId(userId: string): Promise<number> {
    return await this.prisma.userQuestionProgress.count({
      where: { userId: userId },
    });
  }

  public async findByUserIdAndVideoId(
    userId: string,
    videoId: string
  ): Promise<UserQuestionProgress[]> {
    const progressWithQuestions =
      await this.prisma.userQuestionProgress.findMany({
        where: {
          userId: userId,
          question: {
            videoId: videoId,
          },
        },
        include: {
          question: true,
        },
      });

    return progressWithQuestions.map((item) => this.mapToEntity(item));
  }

  private mapToEntity(prismaUserQuestionProgress: any): UserQuestionProgress {
    return new UserQuestionProgress({
      id: prismaUserQuestionProgress.id,
      userId: prismaUserQuestionProgress.userId ?? undefined,
      questionId: prismaUserQuestionProgress.questionId ?? undefined,
      status: prismaUserQuestionProgress.status ?? undefined,
      chosenOption: prismaUserQuestionProgress.chosenOption ?? undefined,
      user: prismaUserQuestionProgress.user ?? undefined,
      question: prismaUserQuestionProgress.question ?? undefined,
    });
  }
}
