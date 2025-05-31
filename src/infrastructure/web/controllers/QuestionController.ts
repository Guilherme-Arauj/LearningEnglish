import { Request, Response } from 'express';
import { QuestionDTO } from '../../../application/dto/QuestionDTO';
import { validateDTOQuestion } from '../../utils/zod/validateDTOQuestion';
import { CreateQuestion } from '../../../application/usecases/CreateQuestion';

export class QuestionController {
    private createQuestionUseCase: CreateQuestion
    
  constructor( createQuestionUseCase: CreateQuestion) {
    this.createQuestionUseCase = createQuestionUseCase;
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
}