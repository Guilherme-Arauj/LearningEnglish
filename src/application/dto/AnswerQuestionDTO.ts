export class AnswerQuestionDTO {
    public questionId: string;
    public answer: string;
    public userId: string;
  
    constructor(
      questionId: string, 
      answer: string,
      userId: string
    ) {
      this.questionId = questionId;
      this.answer = answer;
      this.userId = userId
    }
}