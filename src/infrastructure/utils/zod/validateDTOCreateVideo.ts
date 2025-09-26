import { z } from "zod";

export async function validateDTOCreateVideo(reqSchema: Object, res: any) {
  const createVideoSchema = z.object({
    youtubeVideoId: z.string().min(1, "ID do vídeo do YouTube é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    thumbnailUrl: z.string().url("URL da thumbnail deve ser válida").optional(),
    publishedAt: z.string().datetime("Data de publicação deve ser válida").transform(str => new Date(str)).optional(),
    channelTitle: z.string().optional(),
    tags: z.string().optional(),
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
    } else {
      console.error("Erro desconhecido:", error);
    }
    throw new Error("Dados inválidos");
  }
}