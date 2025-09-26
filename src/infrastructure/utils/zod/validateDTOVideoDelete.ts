import { z } from "zod";

export async function validateDTOVideoDelete(reqSchema: Object, res: any) {
  const videoDeleteSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
  });

  try {
    const video = videoDeleteSchema.parse(reqSchema);
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