import { Request, Response } from 'express';
import { QuestionDTO } from '../../../application/dto/QuestionDTO';
import { validateDTOQuestion } from '../../utils/zod/validateDTOQuestion';
import { CreateQuestion } from '../../../application/usecases/CreateQuestion';
import { validateDTOQuestionUpdate } from '../../utils/zod/validateDTOQuestionUpdate';
import { QuestionUpdateDTO } from '../../../application/dto/QuestionUpdateDTO';
import { UpdateQuestion } from '../../../application/usecases/UpdateQuestion';
import { GetAllQuestions } from '../../../application/usecases/GetAllQuestions';
import { validateDTODeleteQuestion } from '../../utils/zod/validateDTODeleteQuestion';
import { DeleteQuestionDTO } from '../../../application/dto/DeleteQuestionDTO';
import { DeleteQuestion } from '../../../application/usecases/DeleteQuestion';
import { validateDTOAnswerQuestion } from '../../utils/zod/validateDTOAnswerQuestion';
import { AnswerQuestionDTO } from '../../../application/dto/AnswerQuestionDTO';
import { AnswerQuestion } from '../../../application/usecases/AnswerQuestion';

export class QuestionController {
    private createQuestionUseCase: CreateQuestion
    private updateQuestionUseCase: UpdateQuestion
    private getAllQuestionsUseCase: GetAllQuestions
    private deleteQuestionUseCase: DeleteQuestion
    private answerQuestionUseCase: AnswerQuestion
    
  constructor( 
    createQuestionUseCase: CreateQuestion, 
    updateQuestionUseCase: UpdateQuestion, 
    getAllQuestionsUseCase: GetAllQuestions, 
    deleteQuestionUseCase: DeleteQuestion,
    answerQuestionUseCase: AnswerQuestion
  ){
    this.createQuestionUseCase = createQuestionUseCase;
    this.updateQuestionUseCase = updateQuestionUseCase;
    this.getAllQuestionsUseCase = getAllQuestionsUseCase;
    this.deleteQuestionUseCase = deleteQuestionUseCase;
    this.answerQuestionUseCase = answerQuestionUseCase
  }

  public async createQuestion(req: Request, res: Response): Promise<any> {
    try {

      if (!req.user || req.user.privilege !== 'admin') {
        return res.status(403).json({ message: 'Acesso restrito: apenas administradores podem acessar esta rota.' });
      }  

      const { title, cefr, type, theme, optionA, optionB, optionC, response } = req.body;
      const reqSchema = { title, cefr, type, theme, optionA, optionB, optionC, response };

      const validatedData = await validateDTOQuestion(reqSchema, res);
      if (!validatedData) return;

      const dto = new QuestionDTO(
        validatedData.title,
        validatedData.cefr,
        validatedData.type,
        validatedData.theme,
        validatedData.optionA,
        validatedData.optionB,
        validatedData.optionC,
        validatedData.response
      );

      const questionResponse = await this.createQuestionUseCase.execute(dto);

      res.status(201).json({
        message: "Questão criada com sucesso!",
        question: questionResponse
      });
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      res.status(400).json({ message: `Erro ao criar questão - ${error}` });
    }
  }

  public async updateQuestion(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.privilege !== 'admin') {
        return res.status(403).json({ message: 'Acesso restrito: apenas administradores podem acessar esta rota.' });
      }
  
      const { id, ...questionData } = req.body;
      const reqSchema = { id, ...questionData };
  
      const validatedData = await validateDTOQuestionUpdate(reqSchema, res);
      if (!validatedData) return;
  
      const dto = new QuestionUpdateDTO(validatedData.id, validatedData);
  
      const questionResponse = await this.updateQuestionUseCase.execute(dto);
  
      res.status(200).json({
        message: "Questão atualizada com sucesso!",
        question: questionResponse
      });
  
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
      res.status(400).json({ message: `Erro ao atualizar questão - ${error}` });
    }
  }

  public async getAllQuestions(req: Request, res: Response): Promise<any> {
    try {
        const questions = await this.getAllQuestionsUseCase.execute();

        res.status(200).json({
            message: "Questões encontradas com sucesso!",
            questions
        });

    } catch (error) {
        console.error('Erro ao buscar questões:', error);
        res.status(400).json({ message: `Erro ao buscar questões - ${error}` });
    }
  }

  public async deleteQuestion(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.privilege !== 'admin') {
        return res.status(403).json({ message: 'Acesso restrito: apenas administradores podem acessar esta rota.' });
      }

      const { id } = req.body;
      const reqSchema = { id };

      const validatedData = await validateDTODeleteQuestion(reqSchema, res);
      if (!validatedData) return;

      const dto = new DeleteQuestionDTO(validatedData);

      const deletedQuestion = await this.deleteQuestionUseCase.execute(dto);

      res.status(200).json({
        message: "Questão excluída com sucesso!",
        question: deletedQuestion
      });
    } catch (error) {
      console.error('Erro ao excluir questão:', error);
      res.status(400).json({ message: `Erro ao excluir questão - ${error}` });
    }
  }

  public async answerQuestion(req: Request, res: Response): Promise<any> {
    try {
      const { id, answer } = req.body;
      const reqSchema = { id, answer };

      const validatedData = await validateDTOAnswerQuestion(reqSchema, res);
      if(!validatedData) return;

      const dto = new AnswerQuestionDTO(validatedData.id, validatedData.answer);

      const answerQuestion = await this.answerQuestionUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: answerQuestion.correct ? "Resposta correta!" : "Resposta incorreta!",
        data: {
          correct: answerQuestion.correct,
          ...(answerQuestion.correctAnswer && { correctAnswer: answerQuestion.correctAnswer })
        }
      });
    } catch (error) {
      console.error('Erro ao responder questão:', error);
      res.status(400).json({ message: `Erro ao responder questão - ${error}` });
    }
  }
}