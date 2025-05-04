export class UserResponseDTO{
    public id: string;
    public name: string;
    public email: string;
    public privilege: string;
    public cefr: string;

    constructor(
        id: string,
        name:string, 
        email:string, 
        privilege:string, 
        cefr:string
    ){
        this.id = id;
        this.name = name;
        this.email = email;
        this.privilege = privilege;
        this.cefr = cefr;
    }
}

