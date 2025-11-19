import { UserVideoProgress } from "../../../domain/entities/UserVideoProgress";
import { IUserVideoProgressRepository } from "./IUserVideoProgressRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";

export class UserVideoProgressRepository
  implements IUserVideoProgressRepository
{
  constructor(private prismaConfig: IPrismaConfig) {}

  private get prisma() {
    return this.prismaConfig.prisma;
  }

  public async create(
    userVideoProgress: UserVideoProgress
  ): Promise<UserVideoProgress> {
    const created = await this.prisma.userVideoProgress.create({
      data: userVideoProgress.toPersistence(),
    });

    return this.mapToEntity(created);
  }

  public async findByUserAndVideo(
    userId: string,
    videoId: string
  ): Promise<UserVideoProgress | null> {
    const progress = await this.prisma.userVideoProgress.findFirst({
      where: {
        userId: userId,
        videoId: videoId,
      },
    });

    if (!progress) return null;

    return this.mapToEntity(progress);
  }

  public async update(
    userVideoProgress: UserVideoProgress
  ): Promise<UserVideoProgress> {
    const updated = await this.prisma.userVideoProgress.update({
      where: { id: userVideoProgress.id },
      data: userVideoProgress.toPersistence(),
    });

    return this.mapToEntity(updated);
  }

  public async findByUserIdWithVideos(userId: string): Promise<any[]> {
    const progressWithVideos = await this.prisma.userVideoProgress.findMany({
      where: {
        userId: userId,
      },
      include: {
        video: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return progressWithVideos.map((item) => ({
      id: item.id,
      userId: item.userId,
      videoId: item.videoId,
      status: item.status,
      video: item.video, 
    }));
  }

  public async countByUserId(userId: string): Promise<number> {
    return await this.prisma.userVideoProgress.count({
      where: { userId: userId },
    });
  }

  private mapToEntity(prismaUserVideoProgress: any): UserVideoProgress {
    return new UserVideoProgress({
      id: prismaUserVideoProgress.id,
      userId: prismaUserVideoProgress.userId ?? undefined,
      videoId: prismaUserVideoProgress.videoId ?? undefined,
      status: prismaUserVideoProgress.status ?? undefined,
      user: prismaUserVideoProgress.user ?? undefined,
      video: prismaUserVideoProgress.video ?? undefined,
    });
  }
}
