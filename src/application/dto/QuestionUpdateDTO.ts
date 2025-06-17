export class QuestionUpdateDTO {
    public id: string;
    public title?: string;
    public cefr?: string | null;
    public type?: string | null;
    public theme?: string | null;
    public optionA?: string | null;
    public optionB?: string | null;
    public optionC?: string | null;
    public response?: string | null;
  
    constructor(
      id: string,
      data: {
        title?: string;
        cefr?: string | null;
        type?: string | null;
        theme?: string | null;
        optionA?: string | null;
        optionB?: string | null;
        optionC?: string | null;
        response?: string | null;
      }
    ) {
      this.id = id;
      this.title = data.title;
      this.cefr = data.cefr;
      this.type = data.type;
      this.theme = data.theme;
      this.optionA = data.optionA;
      this.optionB = data.optionB;
      this.optionC = data.optionC;
      this.response = data.response;
    }
  }