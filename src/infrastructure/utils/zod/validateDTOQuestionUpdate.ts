import { z } from "zod";

export async function validateDTOQuestionUpdate(reqSchema: object, res: any) {
  const questionUpdateSchema = z.object({
    id: z.string().min(1, "[ID é obrigatório]"),
    title: z.string().min(1, "[Título é obrigatório]").optional(),
    cefr: z.string().max(10, "[CEFR deve ter no máximo 10 caracteres]").optional().nullable(),
    type: z.string().max(50, "[Tipo deve ter no máximo 50 caracteres]").optional().nullable(),
    theme: z.string().max(100, "[Tema deve ter no máximo 100 caracteres]").optional().nullable(),
    optionA: z.string().optional().nullable(),
    optionB: z.string().optional().nullable(),
    optionC: z.string().optional().nullable(),
    response: z.string().max(10, "[Resposta deve ter no máximo 10 caracteres]").optional().nullable(),
  });

  try {
    const question = questionUpdateSchema.parse(reqSchema);
    return question;
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