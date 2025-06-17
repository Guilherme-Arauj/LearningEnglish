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

}