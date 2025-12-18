-- CreateTable
CREATE TABLE `Administrator` (
    `administrator_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Administrator_administrator_id_key`(`administrator_id`),
    UNIQUE INDEX `Administrator_user_id_key`(`user_id`),
    PRIMARY KEY (`administrator_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Advisor` (
    `advisor_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `profile_picture_path` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Advisor_advisor_id_key`(`advisor_id`),
    UNIQUE INDEX `Advisor_user_id_key`(`user_id`),
    PRIMARY KEY (`advisor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Animator` (
    `animator_id` INTEGER NOT NULL AUTO_INCREMENT,
    `advisor_id` VARCHAR(191) NOT NULL,
    `workshop_recurrence_id` INTEGER NOT NULL,

    UNIQUE INDEX `Animator_animator_id_key`(`animator_id`),
    PRIMARY KEY (`animator_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `appointment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `state` ENUM('PENDING', 'CANCELLED', 'MISSED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `advisor_id` VARCHAR(191) NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Appointment_appointment_id_key`(`appointment_id`),
    PRIMARY KEY (`appointment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AppointmentResume` (
    `appointment_resume_id` INTEGER NOT NULL AUTO_INCREMENT,
    `appointment_id` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AppointmentResume_appointment_resume_id_key`(`appointment_resume_id`),
    UNIQUE INDEX `AppointmentResume_appointment_id_key`(`appointment_id`),
    PRIMARY KEY (`appointment_resume_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `article_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `backgroundImagePath` VARCHAR(191) NOT NULL,
    `cardImagePath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Article_article_id_key`(`article_id`),
    PRIMARY KEY (`article_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoAnimator` (
    `co_animator_id` INTEGER NOT NULL AUTO_INCREMENT,
    `external_animator_id` VARCHAR(191) NOT NULL,
    `workshop_recurrence_id` INTEGER NOT NULL,

    UNIQUE INDEX `CoAnimator_co_animator_id_key`(`co_animator_id`),
    PRIMARY KEY (`co_animator_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `document_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('CNI', 'JUSTIFICATION_DOMICILE', 'PASSPORT', 'PERMIS_DE_CONDUIRE', 'REGISTER_FORM', 'OTHER') NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Document_document_id_key`(`document_id`),
    PRIMARY KEY (`document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExternalAnimator` (
    `external_animator_id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ExternalAnimator_external_animator_id_key`(`external_animator_id`),
    UNIQUE INDEX `ExternalAnimator_firstName_lastName_key`(`firstName`, `lastName`),
    PRIMARY KEY (`external_animator_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobSeeker` (
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `assigned_advisor_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JobSeeker_job_seeker_id_key`(`job_seeker_id`),
    UNIQUE INDEX `JobSeeker_user_id_key`(`user_id`),
    PRIMARY KEY (`job_seeker_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `message_id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `sendAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Message_message_id_key`(`message_id`),
    PRIMARY KEY (`message_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `registration_id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` ENUM('REGISTERED', 'PENDING') NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `workshop_recurrence_id` INTEGER NOT NULL,

    UNIQUE INDEX `Registration_registration_id_key`(`registration_id`),
    PRIMARY KEY (`registration_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `tag_name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_tag_name_key`(`tag_name`),
    UNIQUE INDEX `Tag_color_key`(`color`),
    PRIMARY KEY (`tag_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `token_id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `type` ENUM('REFRESH_TOKEN', 'RESET_TOKEN') NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Token_token_id_key`(`token_id`),
    UNIQUE INDEX `Token_token_key`(`token`),
    PRIMARY KEY (`token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UrgentAppointment` (
    `appointment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `advisor_id` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UrgentAppointment_appointment_id_key`(`appointment_id`),
    PRIMARY KEY (`appointment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` CHAR(10) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `roleType` ENUM('JOB_SEEKER', 'ADVISOR', 'ADMINISTRATOR') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_user_id_key`(`user_id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workshop` (
    `workshop_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `cardImagePath` VARCHAR(191) NOT NULL,
    `backgroundImagePath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Workshop_workshop_id_key`(`workshop_id`),
    PRIMARY KEY (`workshop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkshopRecurrence` (
    `workshop_recurrence_id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `topicDescription` TEXT NOT NULL,
    `maxOccupation` INTEGER NOT NULL,
    `workshop_id` INTEGER NOT NULL,

    UNIQUE INDEX `WorkshopRecurrence_workshop_recurrence_id_key`(`workshop_recurrence_id`),
    PRIMARY KEY (`workshop_recurrence_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_article_tags` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_article_tags_AB_unique`(`A`, `B`),
    INDEX `_article_tags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_workshop_tags` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_workshop_tags_AB_unique`(`A`, `B`),
    INDEX `_workshop_tags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Administrator` ADD CONSTRAINT `Administrator_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Advisor` ADD CONSTRAINT `Advisor_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Animator` ADD CONSTRAINT `Animator_advisor_id_fkey` FOREIGN KEY (`advisor_id`) REFERENCES `Advisor`(`advisor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Animator` ADD CONSTRAINT `Animator_workshop_recurrence_id_fkey` FOREIGN KEY (`workshop_recurrence_id`) REFERENCES `WorkshopRecurrence`(`workshop_recurrence_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_advisor_id_fkey` FOREIGN KEY (`advisor_id`) REFERENCES `Advisor`(`advisor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `JobSeeker`(`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AppointmentResume` ADD CONSTRAINT `AppointmentResume_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Administrator`(`administrator_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoAnimator` ADD CONSTRAINT `CoAnimator_external_animator_id_fkey` FOREIGN KEY (`external_animator_id`) REFERENCES `ExternalAnimator`(`external_animator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoAnimator` ADD CONSTRAINT `CoAnimator_workshop_recurrence_id_fkey` FOREIGN KEY (`workshop_recurrence_id`) REFERENCES `WorkshopRecurrence`(`workshop_recurrence_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `JobSeeker`(`job_seeker_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobSeeker` ADD CONSTRAINT `JobSeeker_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobSeeker` ADD CONSTRAINT `JobSeeker_assigned_advisor_id_fkey` FOREIGN KEY (`assigned_advisor_id`) REFERENCES `Advisor`(`advisor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `JobSeeker`(`job_seeker_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_workshop_recurrence_id_fkey` FOREIGN KEY (`workshop_recurrence_id`) REFERENCES `WorkshopRecurrence`(`workshop_recurrence_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UrgentAppointment` ADD CONSTRAINT `UrgentAppointment_advisor_id_fkey` FOREIGN KEY (`advisor_id`) REFERENCES `Advisor`(`advisor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkshopRecurrence` ADD CONSTRAINT `WorkshopRecurrence_workshop_id_fkey` FOREIGN KEY (`workshop_id`) REFERENCES `Workshop`(`workshop_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_article_tags` ADD CONSTRAINT `_article_tags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Article`(`article_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_article_tags` ADD CONSTRAINT `_article_tags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`tag_name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workshop_tags` ADD CONSTRAINT `_workshop_tags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Tag`(`tag_name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workshop_tags` ADD CONSTRAINT `_workshop_tags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Workshop`(`workshop_id`) ON DELETE CASCADE ON UPDATE CASCADE;
