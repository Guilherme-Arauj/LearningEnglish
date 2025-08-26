import { Prisma } from "@prisma/client";
import {User} from "../../../domain/entities/User";

export interface IUserRepository {
    create(user:User): Promise <User>;
    findUserByEmail(email:string): Promise <User | null>;
    findUserById(id: string): Promise <User | null>;
    getUser(id: string): Promise <User | null>;
    updateUser(user: User): Promise<User>;
    get(): Promise<User[]>;
    deleteUserById(id: string): Promise<User>;
}