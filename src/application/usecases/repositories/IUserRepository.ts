import {User} from "../../../domain/entities/User";

export interface IUserRepository {
    create(user:User): Promise <User>;
    validate(email:string): Promise <User | null>;
}