export class DeleteUserDTO {
    public id: string;
  
    constructor({ id }: { id: string }) {
      this.id = id;
    }
  }