import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.personnel.createMany({
    data: [
      {
        emp_code: "emp1",
        name: "علی رضایی",
        job_title: "کارشناس",
        department_name: "IT",
      },
      {
        emp_code: "emp2",
        name: "مریم احمدی",
        job_title: "رئیس",
        department_name: "HR",
      },
    ],
  });

  await prisma.course.createMany({
    data: [
      { code: "course1", title: "مدیریت زمان", category: "عمومی" },
      { code: "course2", title: "اصول رهبری", category: "مدیریتی" },
    ],
  });

  await prisma.jobCourseReq.createMany({
    data: [
      {
        job_title_id: "job1",
        course_code: "course1",
        required: 1,
      },
      {
        job_title_id: "job2",
        course_code: "course2",
        required: 1,
      },
    ],
  });

  await prisma.personCourse.createMany({
    data: [
      {
        emp_code: "emp1",
        course_code: "course1",
        attendancePercent: 90,
        hours: 16,
        status: "passed",
        from: "2023-03-01",
        to: "2023-03-15",
      },
      {
        emp_code: "emp2",
        course_code: "course2",
        attendancePercent: 75,
        hours: 20,
        status: "in_progress",
        from: "2023-04-15",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

