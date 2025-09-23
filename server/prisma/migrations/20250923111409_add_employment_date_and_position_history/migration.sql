/*
  Warnings:

  - You are about to drop the column `from` on the `PersonOrgHistory` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `PersonOrgHistory` table. All the data in the column will be lost.
  - Added the required column `from_date` to the `PersonOrgHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PersonOrgHistory_from_idx";

-- AlterTable
ALTER TABLE "PersonOrgHistory" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "from_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_current" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "to_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Personnel" ADD COLUMN     "employment_date" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "PersonOrgHistory_from_date_idx" ON "PersonOrgHistory"("from_date");

-- CreateIndex
CREATE INDEX "PersonOrgHistory_is_current_idx" ON "PersonOrgHistory"("is_current");

-- CreateIndex
CREATE INDEX "Personnel_employment_date_idx" ON "Personnel"("employment_date");
