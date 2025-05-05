import { Router } from 'express';
import { UserFactory } from '../../factories/UserFactory';

const userRouter = Router();

const userController = UserFactory(); // Usando a Factory para criar o controller

userRouter.post('/cadastro', (req, res) => userController.create(req, res));

export { userRouter };