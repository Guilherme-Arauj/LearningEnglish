import { z } from "zod";
import { Response } from "express";

export async function validateDTOCreateVideo(reqSchema: Object, res: Response) {
  const validCefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const createVideoSchema = z.object({
    youtubeVideoId: z.string().min(1, "ID do vídeo do YouTube é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    thumbnailUrl: z.string().url("URL da thumbnail deve ser válida").optional(),
    publishedAt: z.string()
      .datetime("Data de publicação deve ser válida")
      .transform(str => new Date(str))
      .optional(),
    channelTitle: z.string().optional(),
    tags: z.string().optional(),
    cefr: z.string()
      .min(1, "CEFR é obrigatório")
      .refine(
        (value) => validCefrLevels.includes(value), 
        { message: "CEFR deve ser um nível válido (A1, A2, B1, B2, C1, C2)" }
      ),
  });

  try {
    const video = createVideoSchema.parse(reqSchema);
    return video;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      
      console.error("Erro de validação:", JSON.stringify(errorMessages, null, 2));
      
      res.status(400).json({ 
        message: "Dados inválidos", 
        errors: errorMessages 
      });
      return null;
    } else {
      console.error("Erro desconhecido:", error);
      res.status(500).json({ message: "Erro interno de validação" });
      return null;
    }
  }
}