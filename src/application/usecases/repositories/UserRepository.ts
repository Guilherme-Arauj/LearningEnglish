import { User } from "../../../domain/entities/User";
import { IUserRepository } from "./IUserRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";

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

    public async validate(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }
}