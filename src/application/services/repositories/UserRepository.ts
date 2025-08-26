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

    return new User(created);
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
      },
    });

    return new User(updated);
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
