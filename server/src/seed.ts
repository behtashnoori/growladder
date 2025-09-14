import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      {
        id: "emp1",
        fullName: "علی رضایی",
        rank: "کارشناس",
        hireDate: new Date("2021-01-01"),
        positionStartDate: new Date("2022-01-01"),
      },
      {
        id: "emp2",
        fullName: "مریم احمدی",
        rank: "رئیس",
        hireDate: new Date("2020-06-15"),
        positionStartDate: new Date("2021-07-01"),
      },
    ],
  });

  await prisma.course.createMany({
    data: [
      { courseId: "course1", title: "مدیریت زمان" },
      { courseId: "course2", title: "اصول رهبری" },
    ],
  });

  await prisma.jobRequirement.createMany({
    data: [
      {
        id: "jr1",
        unitId: "unit1",
        jobTitle: "کارشناس آموزش",
        courseId: "course1",
        type: "الزامی",
        priority: "بالا",
      },
      {
        id: "jr2",
        unitId: "unit2",
        jobTitle: "مدیر پروژه",
        courseId: "course2",
        type: "اختیاری",
        priority: "متوسط",
      },
    ],
  });

  await prisma.training.createMany({
    data: [
      {
        id: "tr1",
        employeeId: "emp1",
        courseId: "course1",
        attendancePercent: 90,
        date: new Date("2023-03-01"),
        status: "قبول",
      },
      {
        id: "tr2",
        employeeId: "emp2",
        courseId: "course2",
        attendancePercent: 75,
        date: new Date("2023-04-15"),
        status: "در حال برگزاری",
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

