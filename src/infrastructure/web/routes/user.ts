import { Router } from 'express';
import { UserFactory } from '../../factories/UserFactory';
import { TokenMiddlewareFactory } from '../../factories/TokenMiddlewareFactory';
import { ResetPasswordTokenMiddleware } from '../../../application/middleware/PasswordResetMiddleware';
import { ResetPasswordFactory } from '../../factories/ResetPasswordFactory';

const userRouter = Router();

const userController = UserFactory(); // Usando a Factory para criar o controller
const tokenMiddleware = TokenMiddlewareFactory(); // Usando a Factory de autenticação da rota
const resetPasswordMiddleware = ResetPasswordFactory();

//rota de cadastro de usuário
userRouter.post('/cadastro', (req, res) => userController.create(req, res));

//rota para login
userRouter.post('/login', (req, res) => userController.login(req, res));

//rota me para dados do login
userRouter.get('/me', tokenMiddleware.verifyToken, (req, res) => userController.loggedUser(req, res));

//rota de recuperação de senha
userRouter.post('/recuperarSenha', (req, res) => userController.recuperarSenha(req, res));

//rota de redefinição de senha
userRouter.post('/redefinirSenha', resetPasswordMiddleware.verifyToken, (req, res) => userController.redefinirSenha(req, res));

//rota de atualização de usuário
userRouter.put('/atualizarUsuario', tokenMiddleware.verifyToken, (req, res) => userController.updateUser(req, res));

//rota para listar todos os usuários
userRouter.get('/listarUsuarios', tokenMiddleware.verifyToken, (req, res) => userController.getAll(req, res));

//rota para deletar usuário
userRouter.delete('/deletarUsuario', tokenMiddleware.verifyToken, (req, res) => userController.deleteUser(req, res));

export { userRouter };