import { Router } from 'express';
import { QuestionFactory } from '../../factories/QuestionFactory';
import { TokenMiddlewareFactory } from '../../factories/TokenMiddlewareFactory';
import { UserFactory } from '../../factories/UserFactory';
import { UserQuestionProgressFactory } from '../../factories/UserQuestionProgressFactory';
import { UserVideoProgressFactory } from '../../factories/UserVideoProgressFactory';
import { VideoFactory } from '../../factories/VideoFactory';

const studentRouter = Router();
const questionController = QuestionFactory();
const videoController = VideoFactory();
const userController = UserFactory();
const userQuestionProgressController = UserQuestionProgressFactory();
const userVideoProgressController = UserVideoProgressFactory();
const tokenMiddleware = TokenMiddlewareFactory();

studentRouter.post('/responderQuestao', tokenMiddleware.verifyToken, (req, res) => questionController.answerQuestion(req, res));

studentRouter.get('/trackProgressQuestion', tokenMiddleware.verifyToken, (req, res) => userQuestionProgressController.trackProgress(req,res));

studentRouter.get('/trackProgressVideo', tokenMiddleware.verifyToken, (req, res) => userVideoProgressController.trackProgress(req,res));

studentRouter.post('/addTimeSpent', tokenMiddleware.verifyToken, (req, res) => userController.addStudyTime(req,res));

studentRouter.put('/updateTimeline', tokenMiddleware.verifyToken, (req, res) => userController.updateTimeline(req, res));

studentRouter.get('/getVideosByTimeline', tokenMiddleware.verifyToken, (req, res) => videoController.getVideoQuestionByTimeline(req, res));

studentRouter.get('/getMyContent', tokenMiddleware.verifyToken, (req, res) => videoController.getMyContent(req, res));

studentRouter.put('/updateVideoProgress', tokenMiddleware.verifyToken, (req, res) => userVideoProgressController.updateVideoProgress(req, res))


export { studentRouter };