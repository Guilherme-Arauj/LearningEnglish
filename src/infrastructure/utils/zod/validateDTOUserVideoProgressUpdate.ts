import { z } from "zod";
import { Response } from "express";

export async function validateDTOUserVideoProgressUpdate(reqSchema: object, res: Response) {
  const userVideoProgressUpdateSchema = z.object({
    id: z.string().min(1, "ID do progresso é obrigatório"),
    userId: z.string().min(1, "ID do usuário é obrigatório").optional().nullable(),
    videoId: z.string().min(1, "ID do vídeo é obrigatório").optional().nullable(),
    status: z.boolean().optional().nullable(),
  });

  try {
    const validated = userVideoProgressUpdateSchema.parse(reqSchema);
    return validated;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      console.error("Erro de validação:", JSON.stringify(errorMessages, null, 2));
      res.status(400).json({ errors: errorMessages });
      return null;
    } else {
      console.error("Erro desconhecido:", error);
      res.status(400).json({ message: "Erro desconhecido na validação" });
      return null;
    }
  }
}