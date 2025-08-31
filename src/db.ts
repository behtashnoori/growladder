import Dexie, { Table } from "dexie";

export interface Course {
  code: string;
  title: string;
  category?: string;
  updatedAt: number;
  createdAt: number;
}

export interface Personnel {
  emp_code: string;
  name: string;
  job_code?: string;
  updatedAt: number;
  createdAt: number;
}

export interface CoursePersonnel {
  emp_code: string;
  course_code: string;
  createdAt: number;
}

class GrowLadderDB extends Dexie {
  public courses!: Table<Course, string>;
  public personnel!: Table<Personnel, string>;
  public coursePersonnel!: Table<CoursePersonnel, [string, string]>;

  public constructor() {
    super("growladder");
    this.version(1).stores({
      courses: "&code, title, category, updatedAt, createdAt",
      personnel: "&emp_code, name, job_code, updatedAt, createdAt",
      coursePersonnel: "[emp_code+course_code], emp_code, course_code, createdAt",
    });
  }
}

export const db = new GrowLadderDB();

export async function getCourses(recentSince?: number): Promise<Course[]> {
  const items = await db.courses.toArray();
  return recentSince ? items.filter((c) => c.createdAt >= recentSince) : items;
}

export async function bulkUpsertCourses(items: Course[]): Promise<void> {
  await db.transaction("rw", db.courses, async () => {
    await db.courses.bulkPut(items);
  });
}

