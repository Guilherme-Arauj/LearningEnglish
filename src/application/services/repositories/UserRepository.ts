import { User } from "../../../domain/entities/User";
import { IUserRepository } from "./IUserRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";

export class UserRepository implements IUserRepository {
  constructor(private prismaConfig: IPrismaConfig) {}

  private get prisma() {
    return this.prismaConfig.prisma;
  }

  public async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: user.toPersistence(),
    });

    return this.mapToEntity(created);
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        status: "ACTIVE",
      },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        status: "ACTIVE",
      },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  public async updateUser(user: User): Promise<User> {
    const userData = user.toPersistence();

    const updated = await this.prisma.user.update({
      where: {
        id: user.id,
        status: "ACTIVE",
      },
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        privilege: userData.privilege,
        cefr: userData.cefr,
        timeSpentSeconds: userData.timeSpentSeconds,
        firstAccess: userData.firstAccess,
        timeline: userData.timeline 
      },
    });

    return this.mapToEntity(updated);
  }

  public async deleteUserById(id: string): Promise<User> {
    const deleted = await this.prisma.user.update({
      where: { 
        id,
        status: "ACTIVE"
      },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
      },
    });

    return this.mapToEntity(deleted);
  }

  public async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { status: "ACTIVE" },
    });

    return users.map((user) => this.mapToEntity(user));
  }


  private mapToEntity(prismaUser: any): User {
    return new User({
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        password: prismaUser.password,
        privilege: prismaUser.privilege,
        cefr: prismaUser.cefr,
        timeSpentSeconds: prismaUser.timeSpentSeconds ?? 0,
        timeline: prismaUser.timeline,
        firstAccess: prismaUser.firstAccess,
        userQuestionProgress: prismaUser.userQuestionProgress ?? undefined,
    });
  }
}
