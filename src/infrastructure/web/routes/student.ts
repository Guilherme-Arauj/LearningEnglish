import { Router } from 'express';
import { QuestionFactory } from '../../factories/QuestionFactory';
import { TokenMiddlewareFactory } from '../../factories/TokenMiddlewareFactory';

const studentRouter = Router();
const questionController = QuestionFactory();
const tokenMiddleware = TokenMiddlewareFactory();

studentRouter.post('/responderQuestao', tokenMiddleware.verifyToken, (req, res) => questionController.answerQuestion(req, res));

studentRouter.get('/trackProgress', tokenMiddleware.verifyToken, (req, res) => questionController.trackProgress(req,res));

export { studentRouter };