import { z } from "zod";

export async function validateDTOAnswerQuestion(reqSchema: object, res: any) {
  const answerQuestionSchema = z.object({
    userId: z.string().min(1, "ID do usuário é obrigatório"),
    questionId: z.string().min(1, "ID da questão é obrigatório"),
    answer: z.string().min(1, "Resposta é obrigatória"),
  });

  try {
    const answerQuestion = answerQuestionSchema.parse(reqSchema);
    return answerQuestion;
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