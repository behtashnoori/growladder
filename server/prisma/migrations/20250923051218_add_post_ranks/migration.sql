-- AlterTable
ALTER TABLE "PersonOrgHistory" ADD COLUMN     "post_rank_code" TEXT,
ADD COLUMN     "post_rank_title" TEXT;

-- AlterTable
ALTER TABLE "Personnel" ADD COLUMN     "post_rank_code" TEXT,
ADD COLUMN     "post_rank_title" TEXT;

-- CreateTable
CREATE TABLE "PostRank" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostRank_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "PostRank_title_idx" ON "PostRank"("title");
