import { UserQuestionProgress } from "../../../domain/entities/UserQuestionProgress";
import { IUserQuestionProgressRepository } from "./IUserQuestionProgressRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";

export class UserQuestionProgressRepository implements IUserQuestionProgressRepository {
    constructor(private prismaConfig: IPrismaConfig){}
   
    private get prisma(){
        return this.prismaConfig.prisma
    }

    public async create(userQuestionProgress: UserQuestionProgress): Promise<UserQuestionProgress> {
        const created = await this.prisma.userQuestionProgress.create({
            data: {
                id: userQuestionProgress.id,
                userId: userQuestionProgress.userId,
                questionId: userQuestionProgress.questionId,
                status: userQuestionProgress.status,
                chosenOption: userQuestionProgress.chosenOption
            }
        });
    
        return new UserQuestionProgress({
            id: created.id,
            userId: created.userId ?? undefined,
            questionId: created.questionId ?? undefined,
            status: created.status ?? undefined,
            chosenOption: created.chosenOption ?? undefined,
        });
    }

    public async findByUserAndQuestion(userId: string, questionId: string): Promise<UserQuestionProgress | null> {
        const progress = await this.prisma.userQuestionProgress.findFirst({
            where: { 
                userId: userId,
                questionId: questionId
            }
        });
    
        if (!progress) return null;
    
        return new UserQuestionProgress({
            id: progress.id,
            userId: progress.userId ?? undefined,
            questionId: progress.questionId ?? undefined,
            status: progress.status ?? undefined,
            chosenOption: progress.chosenOption ?? undefined,
        });
    }

    public async update(userQuestionProgress: UserQuestionProgress): Promise<UserQuestionProgress> {
        const updated = await this.prisma.userQuestionProgress.update({
            where: { id: userQuestionProgress.id },
            data: {
                userId: userQuestionProgress.userId,
                questionId: userQuestionProgress.questionId,
                status: userQuestionProgress.status,
                chosenOption: userQuestionProgress.chosenOption
            }
        });
    
        return new UserQuestionProgress({
            id: updated.id,
            userId: updated.userId ?? undefined,
            questionId: updated.questionId ?? undefined,
            status: updated.status ?? undefined,
            chosenOption: updated.chosenOption ?? undefined,
        });
    }

    public async findByUserIdWithQuestions(userId: string): Promise<any[]> {
        const progressWithQuestions = await this.prisma.userQuestionProgress.findMany({
            where: { 
                userId: userId
            },
            include: {
                Question: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        return progressWithQuestions.map(item => ({
            id: item.id,
            userId: item.userId,
            questionId: item.questionId,
            status: item.status,
            chosenOption: item.chosenOption,
            question: item.Question ? {
                title: item.Question.title,
                theme: item.Question.theme,
                cefr: item.Question.cefr,
                type: item.Question.type
            } : null
        }));
    }
}