-- CreateTable
CREATE TABLE `UserVideoProgress` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `videoId` VARCHAR(36) NULL,
    `status` BOOLEAN NULL,

    INDEX `userId`(`userId`),
    INDEX `videoId`(`videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_ibfk_video` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UserVideoProgress` ADD CONSTRAINT `UserVideoProgress_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UserVideoProgress` ADD CONSTRAINT `UserVideoProgress_ibfk_2` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
