-- AlterTable
ALTER TABLE `Question` ADD COLUMN `videoId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `Video` ADD COLUMN `theme` VARCHAR(100) NULL,
    ADD COLUMN `type` VARCHAR(50) NULL;

-- CreateIndex
CREATE INDEX `videoId` ON `Question`(`videoId`);
