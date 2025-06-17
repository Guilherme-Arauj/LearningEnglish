export interface IUuidConfig {
    generateStudentId():Promise<string>;
    generateAdminId(): Promise<string>;
    generateQuestionId(): Promise<string>;
}