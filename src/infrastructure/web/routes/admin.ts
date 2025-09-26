import { Router } from 'express';
import { QuestionFactory } from '../../factories/QuestionFactory';
import { TokenMiddlewareFactory } from '../../factories/TokenMiddlewareFactory';
import { UserFactory } from '../../factories/UserFactory';
import { PrivilegeMiddleware } from '../../../application/middleware/PrivilegeMiddleware';
import { VideoFactory } from '../../factories/VideoFactory';

const adminRouter = Router();

const userController = UserFactory(); 
const questionController = QuestionFactory();
const videoController = VideoFactory();
const tokenMiddleware = TokenMiddlewareFactory();
const privilegeMiddleware = new PrivilegeMiddleware();

//rota de cadastro de usuário pelo admin
adminRouter.post('/adminCadastro', tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => userController.adminCreate(req, res));

//rota para criar questão
adminRouter.post('/criarQuestao', tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => questionController.createQuestion(req, res));

//rota para atualizar questão
adminRouter.put('/atualizarQuestao', tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => questionController.updateQuestion(req, res));

//rota para receber todas as questões
adminRouter.get('/receberQuestoes', tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => questionController.getAllQuestions(req, res));

// rota para excluir questão
adminRouter.delete('/excluirQuestao', tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => questionController.deleteQuestion(req, res));

// rota para criação de vídeo
adminRouter.post("/createVideo", tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => videoController.create(req, res));

// rota para atualização de vídeo
adminRouter.put("/updateVideo/:id", tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => videoController.update(req, res));

// rota para soft delete de vídeo
adminRouter.delete("/deleteVideo/:id", tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => videoController.delete(req, res));

// rota para receber todos os vídeos
adminRouter.get("/getAllVideos", tokenMiddleware.verifyToken, privilegeMiddleware.verifyPrivilege("admin"), (req, res) => videoController.getAll(req, res));

export { adminRouter };