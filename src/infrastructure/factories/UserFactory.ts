import { UserRepository } from "../../application/usecases/repositories/UserRepository";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserController } from "../web/controllers/UserController";
import { IUserRepository } from "../../application/usecases/repositories/IUserRepository";
import { IBcryptConfig } from "../utils/bcrypt/IBcryptConfig";
import { BcryptConfig } from "../utils/bcrypt/BcryptConfig";
import { IUuidConfig } from "../utils/uuid/IUuidConfig";
import { UuidConfig } from "../utils/uuid/UuidConfig";
import { IPrismaConfig } from "../database/IPrismaConfig";
import { PrismaConfig } from "../database/PrismaConfig";



export function UserFactory(): UserController {
    const prismaConfig: IPrismaConfig = new PrismaConfig();
    const secretKey = process.env.SECRET_KEY as string;
    const userRepository: IUserRepository = new UserRepository(prismaConfig);
    const bcryptConfig: IBcryptConfig = new BcryptConfig();
    const uuidConfig: IUuidConfig = new UuidConfig();
 
    const createUserUseCase = new CreateUser(userRepository, bcryptConfig, uuidConfig); // Use Case recebe a interface
    return new UserController(createUserUseCase); // Controller recebe os Use Cases
}
