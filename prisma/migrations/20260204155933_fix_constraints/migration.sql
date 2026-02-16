/*
  Warnings:

  - A unique constraint covering the columns `[advisor_id,workshop_recurrence_id]` on the table `Animator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_animator_id,workshop_recurrence_id]` on the table `CoAnimator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[job_seeker_id,workshop_recurrence_id]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Animator_advisor_id_workshop_recurrence_id_key` ON `Animator`(`advisor_id`, `workshop_recurrence_id`);

-- CreateIndex
CREATE UNIQUE INDEX `CoAnimator_external_animator_id_workshop_recurrence_id_key` ON `CoAnimator`(`external_animator_id`, `workshop_recurrence_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Registration_job_seeker_id_workshop_recurrence_id_key` ON `Registration`(`job_seeker_id`, `workshop_recurrence_id`);
