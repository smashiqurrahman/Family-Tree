/*
  Warnings:

  - A unique constraint covering the columns `[owner_id,name]` on the table `trees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `trees_owner_id_name_key` ON `trees`(`owner_id`, `name`);
