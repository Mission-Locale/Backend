-- Add new columns
ALTER TABLE `appointment` 
    ADD COLUMN `cancelled` BOOLEAN NOT NULL DEFAULT false AFTER `state`,
    ADD COLUMN `endTime` DATETIME(3) AFTER `startTime`;
ALTER TABLE `workshoprecurrence` 
    ADD COLUMN `endTime` DATETIME(3) AFTER `startTime`;

-- Migrate Values
UPDATE `appointment` SET `cancelled` = (`state` = "CANCELLED");
UPDATE `appointment` SET `endTime` = DATE_ADD(`startTime`, INTERVAL `duration` MINUTE);
UPDATE `workshoprecurrence` SET `endTime` = DATE_ADD(`startTime`, INTERVAL `duration` MINUTE);

-- Remove old columns and apply constraints
ALTER TABLE `appointment` 
    DROP COLUMN `duration`,
    DROP COLUMN `state`,
    MODIFY COLUMN `endTime` DATETIME(3) NOT NULL;
ALTER TABLE `workshoprecurrence` 
    DROP COLUMN `duration`,
    MODIFY COLUMN `endTime` DATETIME(3) NOT NULL;