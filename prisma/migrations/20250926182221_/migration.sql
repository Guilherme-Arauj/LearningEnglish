/*
  Warnings:

  - Made the column `cefr` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Video` MODIFY `cefr` VARCHAR(10) NOT NULL;
