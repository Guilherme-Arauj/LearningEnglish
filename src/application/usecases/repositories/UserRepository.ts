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
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        privilege: user.privilege,
        cefr: user.cefr,
        timeSpentSeconds: 0,
      },
    });

    return new User({
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
      privilege: created.privilege,
      cefr: created.cefr,
      timeSpentSeconds: 0,
    });
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        status: "ACTIVE",
      },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      privilege: user.privilege,
      cefr: user.cefr,
      timeSpentSeconds: user.timeSpentSeconds ?? 0,
    });
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        status: "ACTIVE",
      },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      privilege: user.privilege,
      cefr: user.cefr,
      timeSpentSeconds: user.timeSpentSeconds ?? 0,
    });
  }

  public async getUser(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        status: "ACTIVE",
      },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      privilege: user.privilege,
      cefr: user.cefr,
      timeSpentSeconds: user.timeSpentSeconds ?? 0,
    });
  }

  public async changePassword(id: string, newPassword: string): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id: id,
        status: "ACTIVE",
      },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado ou inativo");
    }

    const updated = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: newPassword,
      },
    });

    return new User({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      password: updated.password,
      privilege: updated.privilege,
      cefr: updated.cefr,
      timeSpentSeconds: updated.timeSpentSeconds ?? 0,
    });
  }

  public async updateUser(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: {
        id: user.id,
        status: "ACTIVE",
      },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        privilege: user.privilege,
        cefr: user.cefr,
        timeSpentSeconds: user.timeSpentSeconds ?? 0,
      },
    });

    return new User({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      password: updated.password,
      privilege: updated.privilege,
      cefr: updated.cefr,
      timeSpentSeconds: updated.timeSpentSeconds ?? 0,
    });
  }

  public async deleteUserById(id: string): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) throw new Error("Usuário não encontrado");

    const deleted = await this.prisma.user.update({
      where: { id },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
      },
    });

    return new User({
      id: deleted.id,
      name: deleted.name,
      email: deleted.email,
      password: deleted.password,
      privilege: deleted.privilege,
      cefr: deleted.cefr,
      timeSpentSeconds: deleted.timeSpentSeconds ?? 0,
    });
  }

  public async addStudyTime(
    userId: string,
    secondsToAdd: number
  ): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        status: "ACTIVE",
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado ou inativo");
    }

    const newStudyTime = (user.timeSpentSeconds ?? 0) + secondsToAdd;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { timeSpentSeconds: newStudyTime },
    });

    return new User({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      password: updated.password,
      privilege: updated.privilege,
      cefr: updated.cefr,
      timeSpentSeconds: updated.timeSpentSeconds ?? 0,
    });
  }

  public async get(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { status: "ACTIVE" },
    });

    return users.map(
      (user) =>
        new User({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          privilege: user.privilege,
          cefr: user.cefr,
          timeSpentSeconds: user.timeSpentSeconds ?? 0,
        })
    );
  }
}
