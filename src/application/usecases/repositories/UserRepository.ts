import { User } from "../../../domain/entities/User";
import { IUserRepository } from "./IUserRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";
import { UUIDTypes } from "uuid";
import { Prisma } from "@prisma/client";

export class UserRepository implements IUserRepository {
    constructor(private prismaConfig: IPrismaConfig){}
   
    private get prisma(){
        return this.prismaConfig.prisma
    }

    public async create(user: User): Promise<User> {
        return await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,  
                email: user.email,
                password: user.password,
                privilege: user.privilege,
                cefr: user.cefr,
            }
        });
    }

    public async findUserByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }

    public async findUserById(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where:{
                id: id
            }
        })
    }

    public async getUser(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
    }

    public async changePassword(id: string, newPassword: string): Promise<User> {
        return await this.prisma.user.update({
            where:{
                id:id
            },
            data:{
                password: newPassword
            }
        });
    }


    public async updateUser(user: User): Promise<User> {
        return await this.prisma.user.update({
          where: { id: user.id },
          data: {
            name: user.name,
            email: user.email,
            password: user.password,
            privilege: user.privilege,
            cefr: user.cefr,
          },
        });
    }
}