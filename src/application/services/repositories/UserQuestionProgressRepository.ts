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
            data: userQuestionProgress.toPersistence()
        });
    
        return this.mapToEntity(created);
    }

    public async findByUserAndQuestion(userId: string, questionId: string): Promise<UserQuestionProgress | null> {
        const progress = await this.prisma.userQuestionProgress.findFirst({
            where: { 
                userId: userId,
                questionId: questionId
            }
        });
    
        if (!progress) return null;
    
        return this.mapToEntity(progress);
    }

    public async update(userQuestionProgress: UserQuestionProgress): Promise<UserQuestionProgress> {
        const updated = await this.prisma.userQuestionProgress.update({
            where: { id: userQuestionProgress.id },
            data: userQuestionProgress.toPersistence()
        });
    
        return this.mapToEntity(updated);
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

    private mapToEntity(prismaUserQuestionProgress: any): UserQuestionProgress {
        return new UserQuestionProgress({
            id: prismaUserQuestionProgress.id,
            userId: prismaUserQuestionProgress.userId ?? undefined,
            questionId: prismaUserQuestionProgress.questionId ?? undefined,
            status: prismaUserQuestionProgress.status ?? undefined,
            chosenOption: prismaUserQuestionProgress.chosenOption ?? undefined,
            user: prismaUserQuestionProgress.user ?? undefined,
            question: prismaUserQuestionProgress.question ?? undefined,
        });
    }
}