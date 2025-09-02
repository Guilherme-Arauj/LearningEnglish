import { Request, Response } from "express";
import { UserQuestionProgressService } from "../../../application/services/UserQuestionProgressService";

export class UserQuestionProgressController {
    private userQuestionProgressService: UserQuestionProgressService
    
    constructor(userQuestionProgressService: UserQuestionProgressService){
        this.userQuestionProgressService = userQuestionProgressService;
    }
  
    public async trackProgress(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const progress = await this.userQuestionProgressService.trackProgress(userId);

      res.status(200).json({
        message: "Aqui está seu Progresso!",
        progress,
      });
    } catch (error) {
      console.error("Erro ao busar progresso:", error);
      res.status(400).json({ message: `Erro ao buscar progresso - ${error}` });
    }
  }
}
