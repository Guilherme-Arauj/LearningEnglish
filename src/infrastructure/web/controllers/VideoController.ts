import { CreateVideoDTO } from "../../../application/dto/video/CreateVideoDTO";
import { VideoUpdateDTO } from "../../../application/dto/video/VideoUpdateDTO";
import { VideoDeleteDTO } from "../../../application/dto/video/VideoDeleteDTO";
import { VideoService } from "../../../application/services/VideoService";
import { Request, Response } from "express";
import { validateDTOCreateVideo } from "../../utils/zod/validateDTOCreateVideo";
import { validateDTOVideoUpdate } from "../../utils/zod/validateDTOVideoUpdate";
import { validateDTOVideoDelete } from "../../utils/zod/validateDTOVideoDelete";

export class VideoController {
  private videoService: VideoService;

  constructor(videoService: VideoService) {
    this.videoService = videoService;
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        youtubeVideoId,
        title,
        description,
        thumbnailUrl,
        channelTitle,
        tags,
        cefr,
        publishedAt,
      } = req.body;

      const reqSchema = {
        youtubeVideoId,
        title,
        description,
        thumbnailUrl,
        channelTitle,
        tags,
        cefr,
        publishedAt,
      };

      const validatedData = await validateDTOCreateVideo(reqSchema, res);
      if (!validatedData) return;

      const dto = new CreateVideoDTO(
        validatedData.youtubeVideoId,
        validatedData.title,
        validatedData.cefr,
        validatedData.description,
        validatedData.thumbnailUrl,
        validatedData.publishedAt,
        validatedData.channelTitle,
        validatedData.tags
      );

      const videoResponse = await this.videoService.createVideo(dto);

      res.status(201).json({
        message: "Vídeo criado com sucesso!",
        video: videoResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: `Erro interno do servidor - ${error}` });
      }
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        youtubeVideoId,
        title,
        description,
        thumbnailUrl,
        channelTitle,
        tags,
        publishedAt,
      } = req.body;

      const reqSchema = {
        id,
        youtubeVideoId,
        title,
        description,
        thumbnailUrl,
        channelTitle,
        tags,
        publishedAt,
      };

      const validatedData = await validateDTOVideoUpdate(reqSchema, res);

      const dto = new VideoUpdateDTO(validatedData.id, {
        youtubeVideoId: validatedData.youtubeVideoId,
        title: validatedData.title,
        description: validatedData.description,
        thumbnailUrl: validatedData.thumbnailUrl,
        publishedAt: validatedData.publishedAt,
        channelTitle: validatedData.channelTitle,
        tags: validatedData.tags,
      });

      const videoResponse = await this.videoService.updateVideo(dto);

      res.status(200).json({
        message: "Vídeo atualizado com sucesso!",
        video: videoResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao Atualizar Vídeo - ${error}` });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const reqSchema = { id };

      const validatedData = await validateDTOVideoDelete(reqSchema, res);

      const dto = new VideoDeleteDTO({ id: validatedData.id });

      const videoResponse = await this.videoService.deleteVideo(dto);

      res.status(200).json({
        message: "Vídeo excluído com sucesso!",
        video: videoResponse,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao Excluir Vídeo - ${error}` });
    }
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const videos = await this.videoService.getAllVideos();

      res.status(200).json({
        message: "Vídeos recuperados com sucesso!",
        videos,
      });
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      res.status(400).json({ message: `Erro ao Buscar Vídeos - ${error}` });
    }
  }
}
