import { Request, Response } from "express";
import { UserVideoProgressService } from "../../../application/services/UserVideoProgressService";

export class UserVideoProgressController {
    private userVideoProgressService: UserVideoProgressService
    
    constructor(userVideoProgressService: UserVideoProgressService){
        this.userVideoProgressService = userVideoProgressService;
    }
  
    public async trackProgress(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const progress = await this.userVideoProgressService.trackProgress(userId);

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
