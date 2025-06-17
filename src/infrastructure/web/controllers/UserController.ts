import { Request, Response } from 'express';
import { validateDTOUserUpdate } from '../../utils/zod/validateDTOUserUpdate';
import { validateDTOUser } from '../../utils/zod/validateDTOUser';
import { UserDTO } from '../../../application/dto/UserDTO';
import { CreateUser } from '../../../application/usecases/CreateUser';
import { UserLoginDTO } from '../../../application/dto/UserLoginDTO';
import { Login } from '../../../application/usecases/Login';
import { validateDTOLogin } from '../../utils/zod/validateDTOLogin';
import { validateDTOUserEmail } from '../../utils/zod/validateDTOUserEmail';
import { UserEmailDTO } from '../../../application/dto/UserEmailDTO';
import { RecuperarSenha } from '../../../application/usecases/RecuperarSenha';
import { validateDTOUserNewPassword } from '../../utils/zod/validateDTOUserNewPassword';
import { UserNewPasswordDTO } from '../../../application/dto/UserNewPasswordDTO';
import { RedefinirSenha } from '../../../application/usecases/RedefinirSenha';
import { UserUpdateDTO } from '../../../application/dto/UserUpdateDTO';
import { UpdateUser } from '../../../application/usecases/UpdateUser';
import { GetAllUsers } from '../../../application/usecases/GetAllUsers';
import { validateDTODeleteUser } from '../../utils/zod/validateDTODeleteUser';
import { DeleteUserDTO } from '../../../application/dto/DeleteUserDTO';
import { DeleteUser } from '../../../application/usecases/DeleteUser';


export class UserController {
    private createUserUseCase: CreateUser
    private loginUseCase: Login
    private recuperarSenhaUseCase: RecuperarSenha
    private redefinirSenhaUseCase: RedefinirSenha
    private updateUserUseCase: UpdateUser
    private getAllUsersUseCase: GetAllUsers
    private deleteUserUseCase: DeleteUser

    constructor(
        createUserUseCase: CreateUser,
        loginUseCase: Login,
        recuperarSenhaUseCase: RecuperarSenha,
        redefinirSenhaUseCase: RedefinirSenha,
        updateUserUseCase: UpdateUser,
        getAllUsersUseCase: GetAllUsers,
        deleteUserUseCase: DeleteUser
    ) {
        this.redefinirSenhaUseCase = redefinirSenhaUseCase;
        this.createUserUseCase = createUserUseCase;
        this.loginUseCase = loginUseCase; 
        this.recuperarSenhaUseCase = recuperarSenhaUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
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
                message: "Link de recuperação de senha enviado!",
            });

        } catch (error) {
            console.error('Erro ao processar requisição:', error);
            res.status(400).json({ message: `Erro ao Recuperar Senha - ${error}` });
        }
    }

    public async redefinirSenha(req: Request, res: Response): Promise<any>{
        try {

            const {id, password} = req.body;

            const reqSchema = {id, password};

            const validatedData = await validateDTOUserNewPassword(reqSchema);
            if(!validatedData) return;

            const dto = new UserNewPasswordDTO(validatedData.id, validatedData.password);

            const userResponse = await this.redefinirSenhaUseCase.execute(dto);

            res.status(201).json({
                message: "Senha alterada com sucesso! ",
                userResponse
            });

        } catch (error) {
            console.error('Erro ao processar requisição:', error);
            res.status(400).json({ message: `Erro ao Redefinir Senha - ${error}` });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<any>{
        try {
            
            if (!req.user || req.user.privilege !== 'admin') {
                return res.status(403).json({ message: 'Acesso restrito: apenas administradores podem acessar esta rota.' });
            }

            if (!req.user || req.user.privilege !== 'admin') {
                return res.status(403).json({ message: 'Acesso restrito: apenas administradores podem acessar esta rota.' });
            }

            const { id, ...userData } = req.body;

            const reqSchema = { id, ...userData };

            const validatedData = await validateDTOUserUpdate(reqSchema, res);
            if (!validatedData) return;

            const dto = new UserUpdateDTO(validatedData.id, validatedData); 

            const userResponse = await this.updateUserUseCase.execute(dto);

            res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            userResponse
            });

        } catch (error) {
            console.error('Erro ao processar requisição:', error);
            res.status(400).json({ message: `Erro ao Atualizar Usuário - ${error}` });
        }
    }

    public async getAll(req: Request, res: Response): Promise<any> {
        try {

            if (!req.user || req.user.privilege !== 'admin') {
                return res.status(403).json({ message: 'Acesso restrito: apenas administradores podem acessar esta rota.' });
            }

            const users = await this.getAllUsersUseCase.execute();
            
            res.status(200).json({
                message: "Usuários encontrados com sucesso!",
                users
            });

        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(400).json({ message: `Erro ao buscar usuários - ${error}` });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<any> {
        try {

          if (!req.user || req.user.privilege !== 'admin') {
            return res.status(403).json({ message: 'Acesso restrito: apenas administradores podem acessar esta rota.' });
          }
      
          const { id } = req.body;
          const reqSchema = { id };
      
          const validatedData = await validateDTODeleteUser(reqSchema, res);
          if (!validatedData) return;
      
          const dto = new DeleteUserDTO(validatedData);
      
          const deletedUser = await this.deleteUserUseCase.execute(dto);
      
          if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
          }
      
          return res.status(200).json({ message: 'Usuário excluído com sucesso.', user: deletedUser });
      
        } catch (error) {
          console.error('Erro ao excluir usuários:', error);
          res.status(400).json({ message: `Erro ao excluir usuários - ${error}` });
        }
    }
}