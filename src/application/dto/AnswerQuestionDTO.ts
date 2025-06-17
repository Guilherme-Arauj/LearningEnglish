export class AnswerQuestionDTO {
    public id: string;
    public answer: string;
  
    constructor(id: string, answer: string) {
      this.id = id;
      this.answer = answer;
    }
}