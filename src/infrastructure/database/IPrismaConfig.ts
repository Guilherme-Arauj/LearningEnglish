import { PrismaClient } from "@prisma/client";

export interface IPrismaConfig {
    prisma: PrismaClient;
}