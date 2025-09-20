import { z } from "zod";

export async function validateDTOTimeline(reqSchema: Object, res: any) {
  const timelineSchema = z.object({
    userId: z.string()
      .min(8, "ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)")
      .refine(
        (id) => id.startsWith("STUDENT-") || id.startsWith("ADMIN-"),
        "ID deve começar com 'STUDENT-' ou 'ADMIN-'"
      ),
    timeline: z.number().int("Timeline deve ser um número inteiro")
  });

  try {
    const data = timelineSchema.parse(reqSchema);
    return data;
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