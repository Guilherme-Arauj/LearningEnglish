import { Prisma } from "@prisma/client";
import {Question} from "../../../domain/entities/Question";

export interface IQuestionRepository {
    create(question:Question): Promise <Question>;
    update(question: Question): Promise<Question>;
    findQuestionById(id: string): Promise <Question | null>;
    get(): Promise<Question[]>; 
    delete(questionId: string): Promise<Question>; 
}