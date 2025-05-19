import {User} from "../../domain/entities/User";
import { IUserRepository } from "./repositories/IUserRepository";
import { UserDTO } from "../dto/UserDTO";
import { UserResponseDTO } from "../dto/UserResponseDTO";
import { IBcryptConfig } from "../../infrastructure/utils/bcrypt/IBcryptConfig";
import { IUuidConfig } from "../../infrastructure/utils/uuid/IUuidConfig";

export class CreateUser{
    constructor(
        private userRepository: IUserRepository, 
        private bcryptConfig: IBcryptConfig, 
        private uuidConfig: IUuidConfig
    ){}

    public async execute(dto: UserDTO): Promise <UserResponseDTO>{
        const userValidation = await this.userRepository.findUserByEmail(dto.email);
        
        if(userValidation){
            throw new Error("[Email de usuário já presente no Banco de dados]");
        }

        const hashedPassword = await this.bcryptConfig.hash(dto.password, 10);
    
        const id = dto.privilege === "student" 
            ? await this.uuidConfig.generateStudentId() 
            : await this.uuidConfig.generateAdminId();

        const user = new User({
            id: id,
            name: dto.name,
            email: dto.email,
            privilege: dto.privilege,
            cefr: dto.cefr,
            password: hashedPassword
        });
        

        const savedUser = await this.userRepository.create(user);
        return new UserResponseDTO(
            savedUser.id, 
            savedUser.name, 
            savedUser.email, 
            savedUser.privilege, 
            savedUser.cefr
        );
    }
}