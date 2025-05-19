import { Router } from 'express';
import { UserFactory } from '../../factories/UserFactory';

const userRouter = Router();

const userController = UserFactory(); // Usando a Factory para criar o controller

//rota de cadastro de usuário
userRouter.post('/cadastro', (req, res) => userController.create(req, res));

//rota para login
userRouter.post('/login', (req, res) => userController.login(req, res));

//rota de recuperação de senha
userRouter.post('/recuperarSenha', (req, res) => userController.recuperarSenha(req, res));

export { userRouter };