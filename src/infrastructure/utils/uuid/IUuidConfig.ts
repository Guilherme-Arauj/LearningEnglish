export interface IUuidConfig {
    generateStudentId():Promise<string>;
    generateAdminId(): Promise<string>;
}