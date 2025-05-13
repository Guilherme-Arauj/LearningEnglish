import { Request, Response } from 'express';
import { validateDTOUser } from '../../utils/zod/validateDTOUser';
import { UserDTO } from '../../../application/dto/UserDTO';
import { CreateUser } from '../../../application/usecases/CreateUser';
import { UserLoginDTO } from '../../../application/dto/UserLoginDTO';
import { Login } from '../../../application/usecases/Login';
import { validateDTOLogin } from '../../utils/zod/validateDTOLogin';
import { validateDTOUserEmail } from '../../utils/zod/validateDTOUserEmail';
import { UserEmailDTO } from '../../../application/dto/UserEmailDTO';
import { RecuperarSenha } from '../../../application/usecases/RecuperarSenha';


export class UserController {
    private createUserUseCase: CreateUser
    private loginUseCase: Login
    private recuperarSenhaUseCase: RecuperarSenha

    constructor(
        createUserUseCase: CreateUser,
        loginUseCase: Login,
        recuperarSenhaUseCase: RecuperarSenha
    ) {
        this.createUserUseCase = createUserUseCase;
        this.loginUseCase = loginUseCase; 
        this.recuperarSenhaUseCase = recuperarSenhaUseCase;
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

    public async login(req: Request, res: Response): Promise<any> {
        try {
            
            const {email, password} = req.body;

            const reqSchema = { email, password};

            const validatedData = await validateDTOLogin(reqSchema, res);
            if (!validatedData) return;

            const dto = new UserLoginDTO(validatedData.email, validatedData.password);

            const userResponse = await this.loginUseCase.execute(dto);

            if (!userResponse) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
            
            req.session.user = {
                id: userResponse.id,
                name: userResponse.name,
                privilege: userResponse.privilege,
                token: userResponse.token
            };

            res.status(201).json({
                message: "Login realizado com sucesso!",
                user: userResponse
            });

        } catch (error) {
            console.error('Erro ao processar requisição:', error);
            res.status(400).json({ message: `Erro realizar Login - ${error}` });
        }
    }

    public async recuperarSenha(req: Request, res: Response): Promise<any>{
        try {
            
            const {email} = req.body;

            const reqSchema = {email};

            const validatedData = await validateDTOUserEmail(reqSchema, res);
            if (!validatedData) return;

            const dto = new UserEmailDTO(validatedData.email);

            const userResponse = await this.recuperarSenhaUseCase.execute(dto);

            res.status(201).json({
                message: "Email enviado!",
            });

        } catch (error) {
            console.error('Erro ao processar requisição:', error);
            res.status(400).json({ message: `Erro ao Recuperar Senha - ${error}` });
        }
    }
}