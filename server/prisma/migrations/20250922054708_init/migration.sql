-- CreateTable
CREATE TABLE "Personnel" (
    "emp_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "job_title_id" TEXT,
    "job_title" TEXT,
    "department_id" TEXT,
    "department_name" TEXT,
    "post_code" TEXT,
    "post_title" TEXT,
    "section_code" TEXT,
    "section_title" TEXT,
    "department_code" TEXT,
    "department_title" TEXT,
    "management_code" TEXT,
    "management_title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personnel_pkey" PRIMARY KEY ("emp_code")
);

-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Job" (
    "job_title_id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "department_name" TEXT,
    "department_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("job_title_id")
);

-- CreateTable
CREATE TABLE "PersonCourse" (
    "emp_code" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "status" TEXT,
    "attendancePercent" INTEGER,
    "absencePercent" INTEGER,
    "hours" INTEGER,
    "from" TEXT,
    "to" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonCourse_pkey" PRIMARY KEY ("emp_code","course_code")
);

-- CreateTable
CREATE TABLE "JobCourseReq" (
    "job_title_id" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,
    "required" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobCourseReq_pkey" PRIMARY KEY ("job_title_id","course_code")
);

-- CreateTable
CREATE TABLE "Post" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Section" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Department" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Management" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Management_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "OrgUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitType" TEXT,
    "parentId" TEXT,
    "isIndependent" BOOLEAN NOT NULL DEFAULT false,
    "headRoleAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonOrgHistory" (
    "id" SERIAL NOT NULL,
    "emp_code" TEXT NOT NULL,
    "post_code" TEXT,
    "post_title" TEXT,
    "section_code" TEXT,
    "section_title" TEXT,
    "department_code" TEXT,
    "department_title" TEXT,
    "management_code" TEXT,
    "management_title" TEXT,
    "affiliation" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonOrgHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Personnel_name_job_title_id_idx" ON "Personnel"("name", "job_title_id");

-- CreateIndex
CREATE INDEX "Course_title_idx" ON "Course"("title");

-- CreateIndex
CREATE INDEX "Job_job_title_idx" ON "Job"("job_title");

-- CreateIndex
CREATE INDEX "PersonCourse_emp_code_idx" ON "PersonCourse"("emp_code");

-- CreateIndex
CREATE INDEX "PersonCourse_course_code_idx" ON "PersonCourse"("course_code");

-- CreateIndex
CREATE INDEX "JobCourseReq_job_title_id_idx" ON "JobCourseReq"("job_title_id");

-- CreateIndex
CREATE INDEX "JobCourseReq_course_code_idx" ON "JobCourseReq"("course_code");

-- CreateIndex
CREATE INDEX "Post_title_idx" ON "Post"("title");

-- CreateIndex
CREATE INDEX "Section_title_idx" ON "Section"("title");

-- CreateIndex
CREATE INDEX "Department_title_idx" ON "Department"("title");

-- CreateIndex
CREATE INDEX "Management_title_idx" ON "Management"("title");

-- CreateIndex
CREATE INDEX "OrgUnit_parentId_idx" ON "OrgUnit"("parentId");

-- CreateIndex
CREATE INDEX "OrgUnit_isIndependent_idx" ON "OrgUnit"("isIndependent");

-- CreateIndex
CREATE INDEX "PersonOrgHistory_emp_code_idx" ON "PersonOrgHistory"("emp_code");

-- CreateIndex
CREATE INDEX "PersonOrgHistory_from_idx" ON "PersonOrgHistory"("from");

-- AddForeignKey
ALTER TABLE "PersonCourse" ADD CONSTRAINT "PersonCourse_emp_code_fkey" FOREIGN KEY ("emp_code") REFERENCES "Personnel"("emp_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCourse" ADD CONSTRAINT "PersonCourse_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCourseReq" ADD CONSTRAINT "JobCourseReq_job_title_id_fkey" FOREIGN KEY ("job_title_id") REFERENCES "Job"("job_title_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCourseReq" ADD CONSTRAINT "JobCourseReq_course_code_fkey" FOREIGN KEY ("course_code") REFERENCES "Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOrgHistory" ADD CONSTRAINT "PersonOrgHistory_emp_code_fkey" FOREIGN KEY ("emp_code") REFERENCES "Personnel"("emp_code") ON DELETE CASCADE ON UPDATE CASCADE;
