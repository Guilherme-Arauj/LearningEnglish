import { Question } from "../../../domain/entities/Question";
import { IQuestionRepository } from "./IQuestionRepository";
import { IPrismaConfig } from "../../../infrastructure/database/IPrismaConfig";
import { UUIDTypes } from "uuid";
import { Prisma } from "@prisma/client";

export class QuestionRepository implements IQuestionRepository {
    constructor(private prismaConfig: IPrismaConfig){}
   
    private get prisma(){
        return this.prismaConfig.prisma
    }

    public async create(question: Question): Promise<Question> {
        const created = await this.prisma.question.create({
            data: {
                id: question.id,
                title: question.title,
                cefr: question.cefr,
                type: question.type,
                theme: question.theme,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                response: question.response   
            }
        });
    
        return new Question({
            id: created.id,
            title: created.title,
            cefr: created.cefr ?? undefined,
            type: created.type ?? undefined,
            theme: created.theme ?? undefined,
            optionA: created.optionA ?? undefined,
            optionB: created.optionB ?? undefined,
            optionC: created.optionC ?? undefined,
            response: created.response ?? undefined,
        });
    }

    public async update(question: Question): Promise<Question> {
        const updated = await this.prisma.question.update({
            where: { id: question.id },
            data: {
                title: question.title,
                cefr: question.cefr,
                type: question.type,
                theme: question.theme,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                response: question.response
            }
        });
    
        return new Question({
            id: updated.id,
            title: updated.title,
            cefr: updated.cefr ?? undefined,
            type: updated.type ?? undefined,
            theme: updated.theme ?? undefined,
            optionA: updated.optionA ?? undefined,
            optionB: updated.optionB ?? undefined,
            optionC: updated.optionC ?? undefined,
            response: updated.response ?? undefined,
        });
    }

    public async findQuestionById(id: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: { id }
        });
    
        if (!question) return null;
    
        return new Question({
            id: question.id,
            title: question.title,
            cefr: question.cefr ?? undefined,
            type: question.type ?? undefined,
            theme: question.theme ?? undefined,
            optionA: question.optionA ?? undefined,
            optionB: question.optionB ?? undefined,
            optionC: question.optionC ?? undefined,
            response: question.response ?? undefined,
        });
    }

    public async get(): Promise<Question[]> {
        const questions = await this.prisma.question.findMany();
        return questions.map(q => new Question({
            id: q.id,
            title: q.title,
            cefr: q.cefr ?? undefined,
            type: q.type ?? undefined,
            theme: q.theme ?? undefined,
            optionA: q.optionA ?? undefined,
            optionB: q.optionB ?? undefined,
            optionC: q.optionC ?? undefined,
            response: q.response ?? undefined,
        }));
    }
}