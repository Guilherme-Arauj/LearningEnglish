import { z } from "zod";

export async function validateDTOQuestion(reqSchema: object, res: any) {
  const validCefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const questionSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    cefr: z.string()
      .refine(
        (value) => validCefrLevels.includes(value), 
        { message: "CEFR deve ser um nível válido (A1, A2, B1, B2, C1, C2)" }
      )
      .optional()
      .nullable(),
    type: z.string().max(50, "Tipo deve ter no máximo 50 caracteres").optional().nullable(),
    theme: z.string().max(100, "Tema deve ter no máximo 100 caracteres").optional().nullable(),
    optionA: z.string().optional().nullable(),
    optionB: z.string().optional().nullable(),
    optionC: z.string().optional().nullable(),
    response: z.string().max(10, "Resposta deve ter no máximo 10 caracteres").optional().nullable(),
  });

  try {
    const question = questionSchema.parse(reqSchema);
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