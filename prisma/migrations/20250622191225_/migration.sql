/*
  Warnings:

  - You are about to drop the `DeletedQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Question` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE `DeletedQuestion`;
