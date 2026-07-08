-- AlterTable
ALTER TABLE `shipment` ADD COLUMN `assignedDriverId` VARCHAR(191) NULL,
    ADD COLUMN `assignedTruckId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_assignedDriverId_fkey` FOREIGN KEY (`assignedDriverId`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_assignedTruckId_fkey` FOREIGN KEY (`assignedTruckId`) REFERENCES `Truck`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
