import { Router } from 'express';
import { QuestionFactory } from '../../factories/QuestionFactory';
import { TokenMiddlewareFactory } from '../../factories/TokenMiddlewareFactory';

const adminRouter = Router();

const questionController = QuestionFactory();
const tokenMiddleware = TokenMiddlewareFactory();

//rota para criar questão
adminRouter.post('/criarQuestao', tokenMiddleware.verifyToken, (req, res) => questionController.createQuestion(req, res));

export { adminRouter };