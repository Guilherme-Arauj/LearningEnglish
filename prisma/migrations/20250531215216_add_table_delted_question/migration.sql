-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(36) NOT NULL,
    `title` TEXT NOT NULL,
    `cefr` VARCHAR(10) NULL,
    `type` VARCHAR(50) NULL,
    `theme` VARCHAR(100) NULL,
    `optionA` TEXT NULL,
    `optionB` TEXT NULL,
    `optionC` TEXT NULL,
    `response` VARCHAR(10) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `cefr` VARCHAR(10) NOT NULL,
    `privilege` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserQuestionProgress` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `questionId` VARCHAR(36) NULL,
    `status` BOOLEAN NULL,
    `chosenOption` VARCHAR(10) NULL,

    INDEX `questionId`(`questionId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeletedQuestion` (
    `id` VARCHAR(36) NOT NULL,
    `title` TEXT NOT NULL,
    `cefr` VARCHAR(10) NULL,
    `type` VARCHAR(50) NULL,
    `theme` VARCHAR(100) NULL,
    `optionA` TEXT NULL,
    `optionB` TEXT NULL,
    `optionC` TEXT NULL,
    `response` VARCHAR(10) NULL,
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserQuestionProgress` ADD CONSTRAINT `UserQuestionProgress_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UserQuestionProgress` ADD CONSTRAINT `UserQuestionProgress_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
