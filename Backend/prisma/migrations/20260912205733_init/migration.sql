/*
  Warnings:

  - You are about to alter the column `status` on the `truck` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(8))` to `Enum(EnumId(6))`.

*/
-- AlterTable
ALTER TABLE `truck` MODIFY `status` ENUM('AVAILABLE', 'IN_WORK', 'IN_MAINTENANCE', 'OUT') NOT NULL DEFAULT 'AVAILABLE';
