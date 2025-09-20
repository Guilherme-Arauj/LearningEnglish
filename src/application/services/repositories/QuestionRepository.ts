import { Question } from "../../../domain/entities/Question";
import { IQuestionRepository } from "./IQuestionRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";

export class QuestionRepository implements IQuestionRepository {
    constructor(private prismaConfig: IPrismaConfig){}
   
    private get prisma(){
        return this.prismaConfig.prisma
    }

    public async create(question: Question): Promise<Question> {
        const created = await this.prisma.question.create({
            data: question.toPersistence()
        });
    
        return this.mapToEntity(created);
    }

    public async update(question: Question): Promise<Question> {
        const existingQuestion = await this.findQuestionById(question.id);
        if (!existingQuestion) {
            throw new Error('Questão não encontrada ou foi excluída');
        }

        const updated = await this.prisma.question.update({
            where: { 
                id: question.id,
                status: "ACTIVE" 
            },
            data: question.toPersistence()
        });
    
        return this.mapToEntity(updated);
    }

    public async findQuestionById(id: string): Promise<Question | null> {
        const question = await this.prisma.question.findFirst({
            where: { 
                id,
                status: "ACTIVE"
            }
        });
    
        if (!question) return null;
        return this.mapToEntity(question);
    }

    public async get(): Promise<Question[]> {
        const questions = await this.prisma.question.findMany({
            where: { status: "ACTIVE" }
        });
        
        return questions.map(q => this.mapToEntity(q));
    }

    public async delete(id: string): Promise<Question> {
        const question = await this.findQuestionById(id);
        if (!question) {
            throw new Error('Questão não encontrada');
        }
    
        const deletedQuestion = await this.prisma.question.update({
            where: { id },
            data: {
                status: "DELETED",
                deletedAt: new Date()
            }
        });
    
        return this.mapToEntity(deletedQuestion);
    }

    public async getDeleted(): Promise<Question[]> {
        const questions = await this.prisma.question.findMany({
            where: { status: "DELETED" }
        });
        
        return questions.map(q => this.mapToEntity(q));
    }

    public async restore(id: string): Promise<Question> {
        const question = await this.prisma.question.findFirst({
            where: { 
                id,
                status: "DELETED"
            }
        });

        if (!question) {
            throw new Error('Questão deletada não encontrada');
        }

        const restoredQuestion = await this.prisma.question.update({
            where: { id },
            data: {
                status: "ACTIVE",
                deletedAt: null
            }
        });

        return this.mapToEntity(restoredQuestion);
    }

    public async findById(id: string, includeDeleted: boolean = false): Promise<Question | null> {
        const whereClause = includeDeleted 
            ? { id } 
            : { id, status: "ACTIVE" };

        const question = await this.prisma.question.findFirst({
            where: whereClause
        });
    
        if (!question) return null;
        return this.mapToEntity(question);
    }

    private mapToEntity(prismaQuestion: any): Question {
        return new Question({
            id: prismaQuestion.id,
            title: prismaQuestion.title,
            cefr: prismaQuestion.cefr ?? undefined,
            type: prismaQuestion.type ?? undefined,
            theme: prismaQuestion.theme ?? undefined,
            optionA: prismaQuestion.optionA ?? undefined,
            optionB: prismaQuestion.optionB ?? undefined,
            optionC: prismaQuestion.optionC ?? undefined,
            response: prismaQuestion.response ?? undefined,
        });
    }
}