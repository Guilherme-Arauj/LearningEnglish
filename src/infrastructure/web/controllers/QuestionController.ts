import { Request, Response } from 'express';
import { QuestionDTO } from '../../../application/dto/QuestionDTO';
import { validateDTOQuestion } from '../../utils/zod/validateDTOQuestion';
import { validateDTOQuestionUpdate } from '../../utils/zod/validateDTOQuestionUpdate';
import { QuestionUpdateDTO } from '../../../application/dto/QuestionUpdateDTO';
import { validateDTODeleteQuestion } from '../../utils/zod/validateDTODeleteQuestion';
import { DeleteQuestionDTO } from '../../../application/dto/DeleteQuestionDTO';
import { validateDTOAnswerQuestion } from '../../utils/zod/validateDTOAnswerQuestion';
import { AnswerQuestionDTO } from '../../../application/dto/AnswerQuestionDTO';
import { QuestionService } from '../../../application/services/QuestionService';

export class QuestionController {
    private questionService: QuestionService

    
  constructor( 
    questionService: QuestionService, 
  ){
    this.questionService = questionService;
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

      const questionResponse = await this.questionService.createQuestion(dto);

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
  
      const questionResponse = await this.questionService.updateQuestion(dto);
  
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
        const questions = await this.questionService.getAllQuestions();

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

      const deletedQuestion = await this.questionService.deleteQuestion(dto);

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
      const userId = req.user?.id;

      const {questionId, answer } = req.body;
      const reqSchema = { questionId, answer, userId };

      const validatedData = await validateDTOAnswerQuestion(reqSchema, res);
      if(!validatedData) return;

      const dto = new AnswerQuestionDTO(validatedData.questionId, validatedData.answer, validatedData.userId);

      const answerQuestion = await this.questionService.answerQuestion(dto);

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