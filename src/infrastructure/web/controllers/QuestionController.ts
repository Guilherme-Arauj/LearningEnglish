import { Request, Response } from 'express';
import { QuestionDTO } from '../../../application/dto/QuestionDTO';
import { validateDTOQuestion } from '../../utils/zod/validateDTOQuestion';
import { CreateQuestion } from '../../../application/usecases/CreateQuestion';
import { validateDTOQuestionUpdate } from '../../utils/zod/validateDTOQuestionUpdate';
import { QuestionUpdateDTO } from '../../../application/dto/QuestionUpdateDTO';
import { UpdateQuestion } from '../../../application/usecases/UpdateQuestion';

export class QuestionController {
    private createQuestionUseCase: CreateQuestion
    private updateQuestionUseCase: UpdateQuestion
    
  constructor( createQuestionUseCase: CreateQuestion, updateQuestionUseCase: UpdateQuestion) {
    this.createQuestionUseCase = createQuestionUseCase;
    this.updateQuestionUseCase = updateQuestionUseCase;
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
}