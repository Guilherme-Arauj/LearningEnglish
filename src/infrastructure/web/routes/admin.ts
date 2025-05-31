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

//rota para receber todas as questões
adminRouter.get('/receberQuestoes', tokenMiddleware.verifyToken, (req, res) => questionController.getAllQuestions(req, res));

// rota para excluir questão
adminRouter.delete('/excluirQuestao', tokenMiddleware.verifyToken, (req, res) => questionController.deleteQuestion(req, res));

export { adminRouter };