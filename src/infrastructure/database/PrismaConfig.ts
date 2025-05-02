import { PrismaClient } from "@prisma/client";
import { IPrismaConfig } from "./IPrismaConfig";

export class PrismaConfig implements IPrismaConfig {
    public prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
}