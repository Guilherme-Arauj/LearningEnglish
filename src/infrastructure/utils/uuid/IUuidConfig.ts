export interface IUuidConfig {
    generateStudentId():Promise<string>;
    generateAdminId(): Promise<string>;
    generateQuestionId(): Promise<string>;
    generateUserQuestionProgressId(): Promise<string>;
    generateVideoId(): Promise<string>;
}