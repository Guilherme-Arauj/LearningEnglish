export class UserDTO{
    public name: string;
    public email: string;
    public password: string;
    public privilege: string;
    public cefr: string;
    public timeline: number;

    constructor(
        name:string, 
        email:string, 
        password:string, 
        privilege:string, 
        cefr:string,
        timeline: number
    ){
        this.name = name;
        this.email = email;
        this.password = password;
        this.privilege = privilege;
        this.cefr = cefr;
        this.timeline = timeline;
    }
}

