import { z } from "zod";

export async function validateDTOAddStudyTime(reqSchema: Object, res: any) {
  const addStudyTimeSchema = z.object({
    userId: z.string()
      .min(8, "ID deve ter pelo menos 8 caracteres (prefixo + 6 chars)")
      .refine(
        (id) => id.startsWith("STUDENT-") || id.startsWith("ADMIN-"),
        "ID deve começar com 'STUDENT-' ou 'ADMIN-'"
      ),
    timeToAdd: z.number()
      .int("Tempo a adicionar deve ser um número inteiro")
      .positive("Tempo a adicionar deve ser maior que zero"),
  });

  try {
    const validated = addStudyTimeSchema.parse(reqSchema);
    return validated;
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