import { Prisma } from "@prisma/client";
import {Question} from "../../../domain/entities/Question";

export interface IQuestionRepository {
    create(question:Question): Promise <Question>;
}