import { Router } from 'express';
import { QuestionFactory } from '../../factories/QuestionFactory';
import { TokenMiddlewareFactory } from '../../factories/TokenMiddlewareFactory';
import { UserFactory } from '../../factories/UserFactory';

const studentRouter = Router();
const questionController = QuestionFactory();
const userController = UserFactory();
const tokenMiddleware = TokenMiddlewareFactory();

studentRouter.post('/responderQuestao', tokenMiddleware.verifyToken, (req, res) => questionController.answerQuestion(req, res));

studentRouter.get('/trackProgress', tokenMiddleware.verifyToken, (req, res) => questionController.trackProgress(req,res));

studentRouter.post('/addTimeSpent', tokenMiddleware.verifyToken, (req, res) => userController.addStudyTime(req,res));

export { studentRouter };