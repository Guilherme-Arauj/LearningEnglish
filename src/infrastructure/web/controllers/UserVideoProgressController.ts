import { Request, Response } from "express";
import { UserVideoProgressService } from "../../../application/services/UserVideoProgressService";
import { UserVideoProgressUpdateDTO } from "../../../application/dto/studentUser/UserVideoProgressUpdateDTO";
import { validateDTOUserVideoProgressUpdate } from "../../utils/zod/validateDTOUserVideoProgressUpdate";

export class UserVideoProgressController {
  private userVideoProgressService: UserVideoProgressService;

  constructor(userVideoProgressService: UserVideoProgressService) {
    this.userVideoProgressService = userVideoProgressService;
  }

  public async trackProgress(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const progress = await this.userVideoProgressService.trackProgress(
        userId
      );

      res.status(200).json({
        message: "Aqui está seu Progresso!",
        progress,
      });
    } catch (error) {
      console.error("Erro ao busar progresso:", error);
      res.status(400).json({ message: `Erro ao buscar progresso - ${error}` });
    }
  }

  public async updateVideoProgress(req: Request, res: Response): Promise<any> {
    try {
      const { id, ...progressData } = req.body;
      const reqSchema = { id, ...progressData };

      const validatedData = await validateDTOUserVideoProgressUpdate(
        reqSchema,
        res
      );
      if (!validatedData) return;

      const dto = new UserVideoProgressUpdateDTO(
        validatedData.id,
        validatedData
      );

      const progressResponse =
        await this.userVideoProgressService.updateUserVideoProgress(dto);

      res.status(200).json({
        message: "Progresso de vídeo atualizado com sucesso!",
        progress: progressResponse,
      });
    } catch (error) {
      console.error("Erro ao atualizar progresso de vídeo:", error);
      res
        .status(400)
        .json({ message: `Erro ao atualizar progresso de vídeo - ${error}` });
    }
  }
}
