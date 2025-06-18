export class UserQuestionProgressResponseDTO {
    public id: number;
    public userId: string;
    public questionId: number;
    public status: string;
    public chosenOption?: string | null;
    public question?: {
        title: string;
        theme: string;
        cefr: string;
        type: string;
    } | null;

    constructor(
        id: number,
        userId: string,
        questionId: number,
        status: string,
        chosenOption?: string | null,
        question?: {
            title: string;
            theme: string;
            cefr: string;
            type: string;
        } | null
    ) {
        this.id = id;
        this.userId = userId;
        this.questionId = questionId;
        this.status = status;
        this.chosenOption = chosenOption;
        this.question = question;
    }
}