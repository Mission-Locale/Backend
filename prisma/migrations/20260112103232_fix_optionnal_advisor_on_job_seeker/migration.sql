-- DropForeignKey
ALTER TABLE `jobseeker` DROP FOREIGN KEY `JobSeeker_assigned_advisor_id_fkey`;

-- DropIndex
DROP INDEX `JobSeeker_assigned_advisor_id_fkey` ON `jobseeker`;

-- AlterTable
ALTER TABLE `jobseeker` MODIFY `assigned_advisor_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `JobSeeker` ADD CONSTRAINT `JobSeeker_assigned_advisor_id_fkey` FOREIGN KEY (`assigned_advisor_id`) REFERENCES `Advisor`(`advisor_id`) ON DELETE SET NULL ON UPDATE CASCADE;
