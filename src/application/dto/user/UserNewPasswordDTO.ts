export class UserNewPasswordDTO{
    public id: string;
    public password: string;

    constructor(id:string, password:string){
        this.id = id;
        this.password = password;
    }
}