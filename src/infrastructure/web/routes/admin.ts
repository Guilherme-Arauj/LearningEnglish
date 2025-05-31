import { Router } from 'express';
import { QuestionFactory } from '../../factories/QuestionFactory';
import { TokenMiddlewareFactory } from '../../factories/TokenMiddlewareFactory';

const adminRouter = Router();

const questionController = QuestionFactory();
const tokenMiddleware = TokenMiddlewareFactory();

//rota para criar questão
adminRouter.post('/criarQuestao', tokenMiddleware.verifyToken, (req, res) => questionController.createQuestion(req, res));

//rota para atualizar questão
adminRouter.put('/atualizarQuestao', tokenMiddleware.verifyToken, (req, res) => questionController.updateQuestion(req, res));

export { adminRouter };