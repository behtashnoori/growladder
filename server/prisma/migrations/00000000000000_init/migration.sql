-- CreateTable
CREATE TABLE "Employee" (
  "id" TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "unitId" TEXT,
  "rank" TEXT,
  "hireDate" DATETIME,
  "positionStartDate" DATETIME,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Course" (
  "courseId" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "JobRequirement" (
  "id" TEXT PRIMARY KEY,
  "unitId" TEXT,
  "jobTitle" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "type" TEXT,
  "priority" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "JobRequirement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Training" (
  "id" TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "attendancePercent" INTEGER,
  "date" DATETIME,
  "status" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Training_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Training_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("courseId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Employee_fullName_unitId_rank_idx" ON "Employee"("fullName","unitId","rank");
CREATE INDEX "Course_title_idx" ON "Course"("title");
CREATE INDEX "JobRequirement_jobTitle_unitId_idx" ON "JobRequirement"("jobTitle","unitId");
CREATE INDEX "Training_employeeId_date_idx" ON "Training"("employeeId","date");
