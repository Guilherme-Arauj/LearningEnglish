export class QuestionDTO {
    public title: string;
    public cefr?: string | null;
    public type?: string | null;
    public theme?: string | null;
    public optionA?: string | null;
    public optionB?: string | null;
    public optionC?: string | null;
    public response?: string | null;
  
    constructor(
      title: string,
      cefr?: string | null,
      type?: string | null,
      theme?: string | null,
      optionA?: string | null,
      optionB?: string | null,
      optionC?: string | null,
      response?: string | null
    ) {
      this.title = title;
      this.cefr = cefr;
      this.type = type;
      this.theme = theme;
      this.optionA = optionA;
      this.optionB = optionB;
      this.optionC = optionC;
      this.response = response;
    }
  }