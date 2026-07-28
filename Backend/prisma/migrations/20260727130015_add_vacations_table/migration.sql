/*
  Warnings:

  - You are about to drop the column `from_date` on the `driver` table. All the data in the column will be lost.
  - You are about to drop the column `to_date` on the `driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `driver` DROP COLUMN `from_date`,
    DROP COLUMN `to_date`;

-- CreateTable
CREATE TABLE `Vacations` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('REST') NOT NULL DEFAULT 'REST',
    `returning` BOOLEAN NOT NULL DEFAULT false,
    `from_date` DATETIME(3) NOT NULL,
    `to_date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vacations` ADD CONSTRAINT `Vacations_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
