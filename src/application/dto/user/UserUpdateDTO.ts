export class UserUpdateDTO {
    public id: string;
    public name?: string;
    public email?: string;
    public password?: string;
    public privilege?: string;
    public cefr?: string;
  
    constructor(
      id: string,
      {
        name,
        email,
        password,
        privilege,
        cefr
      }: {
        name?: string;
        email?: string;
        password?: string;
        privilege?: string;
        cefr?: string;
      }
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.privilege = privilege;
      this.cefr = cefr;
    }
  }