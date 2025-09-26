export class DeleteQuestionDTO {
    public id: string;
  
    constructor({ id }: { id: string }) {
      this.id = id;
    }
  }