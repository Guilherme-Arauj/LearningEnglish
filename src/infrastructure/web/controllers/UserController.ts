import { Request, Response } from 'express';
import { validateDTOUser } from '../../utils/zod/validateDTOUser';
import { UserDTO } from '../../../application/dto/UserDTO';
import { CreateUser } from '../../../application/usecases/CreateUser';


export class UserController {
    private createUserUseCase: CreateUser

    constructor(createUserUseCase: CreateUser) {
        this.createUserUseCase = createUserUseCase;
    }

    public async create(req: Request, res: Response): Promise<any> {
        try {
            const {name, email, password, privilege, cefr} = req.body;

            const reqSchema = {name, email, password, privilege, cefr};

            const validatedData = await validateDTOUser(reqSchema, res);
            if (!validatedData) return; 

            const dto = new UserDTO(validatedData.name, validatedData.email, validatedData.password, validatedData.privilege, validatedData.cefr);
            
            const userResponse = await this.createUserUseCase.execute(dto);

            res.status(201).json({
                message: "Cadastro realizado com sucesso!",
                user: userResponse
            });
        } catch (error) {
            console.error('Erro ao processar requisição:', error);
            res.status(400).json({ message: `Erro ao criar usuário - ${error}` });
        }
    }
}