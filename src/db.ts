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
  job_title_id?: string;
  job_title?: string;
  department_id?: string;
  department_name?: string;
  decree_code?: string;
  decree_title?: string;
  post_code?: string;
  post_title?: string;
  section_code?: string;
  section_title?: string;
  department_code?: string;
  department_title?: string;
  management_code?: string;
  management_title?: string;
  updatedAt: number;
  createdAt: number;
}

export interface CoursePersonnel {
  emp_code: string;
  course_code: string;
  createdAt: number;
}

export interface PersonCourse {
  emp_code: string;
  course_code: string;
  status?: "passed" | "in_progress" | "failed";
  score?: number;
  date?: string;
  createdAt: number;
}

export interface Job {
  job_title_id: string;
  job_title: string;
  department_name?: string;
  department_id?: string;
  updatedAt: number;
  createdAt: number;
}

export interface JobCourseReq {
  job_title_id: string;
  course_code: string;
  required: number;
  createdAt: number;
}

export interface Master {
  code: string;
  title: string;
  note?: string;
  updatedAt: number;
  createdAt: number;
}

class GrowLadderDB extends Dexie {
  public courses!: Table<Course, string>;
  public personnel!: Table<Personnel, string>;
  public coursePersonnel!: Table<CoursePersonnel, [string, string]>;
  public personCourse!: Table<PersonCourse, [string, string]>;
  public jobs!: Table<Job, string>;
  public jobCourseReq!: Table<JobCourseReq, [string, string]>;
  public decrees!: Table<Master, string>;
  public posts!: Table<Master, string>;
  public sections!: Table<Master, string>;
  public departments!: Table<Master, string>;
  public managements!: Table<Master, string>;

  public constructor() {
    super("growladder");
    this.version(1).stores({
      courses: "&code, title, category, updatedAt, createdAt",
      personnel: "&emp_code, name, job_code, updatedAt, createdAt",
      coursePersonnel: "[emp_code+course_code], emp_code, course_code, createdAt",
    });
    this.version(2).stores({
      jobs: "&job_title_id, job_title, department_name, department_id, updatedAt, createdAt",
      jobCourseReq: "[job_title_id+course_code], job_title_id, course_code, required, createdAt",
    });
    this.version(3)
      .stores({
        personnel:
          "&emp_code, name, job_title_id, job_title, department_id, department_name, updatedAt, createdAt",
        personCourse:
          "[emp_code+course_code], emp_code, course_code, status, score, date, createdAt",
      })
      .upgrade(async (tx) => {
        const tbl = tx.table<Personnel, string>("personnel");
        await tbl.toCollection().modify((p) => {
          const rec = p as unknown as { job_code?: string; job_title_id?: string };
          rec.job_title_id = rec.job_code;
          delete rec.job_code;
        });
      });

    this.version(4)
      .stores({
        personnel:
          "&emp_code, name, job_title_id, job_title, department_id, department_name, decree_code, decree_title, post_code, post_title, section_code, section_title, department_code, department_title, management_code, management_title, updatedAt, createdAt",
        decrees: "&code, title, note, updatedAt, createdAt",
        posts: "&code, title, updatedAt, createdAt",
        sections: "&code, title, updatedAt, createdAt",
        departments: "&code, title, updatedAt, createdAt",
        managements: "&code, title, updatedAt, createdAt",
      })
      .upgrade((tx) => {
        const tbl = tx.table<Personnel, string>("personnel");
        return tbl.toCollection().modify(() => {});
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

export async function getPersonnel(
  recentSince?: number
): Promise<Personnel[]> {
  const items = await db.personnel.toArray();
  return recentSince ? items.filter((p) => p.createdAt >= recentSince) : items;
}

export async function bulkUpsertPersonnel(items: Personnel[]): Promise<void> {
  await db.transaction("rw", db.personnel, async () => {
    await chunkedBulkPut(db.personnel, items);
  });
}

export async function getPersonCourses(
  emp_code: string
): Promise<PersonCourse[]> {
  return db.personCourse.where({ emp_code }).toArray();
}

export async function getJobs(recentSince?: number): Promise<Job[]> {
  const items = await db.jobs.toArray();
  return recentSince ? items.filter((j) => j.createdAt >= recentSince) : items;
}

export async function getJobCourseReq(job_title_id: string): Promise<JobCourseReq[]> {
  return db.jobCourseReq.where({ job_title_id }).toArray();
}

async function chunkedBulkPut<T, K>(table: Table<T, K>, items: T[]): Promise<void> {
  const chunk = 1000;
  for (let i = 0; i < items.length; i += chunk) {
    await table.bulkPut(items.slice(i, i + chunk));
    await new Promise((r) => setTimeout(r));
  }
}

export async function bulkUpsertJobs(items: Job[]): Promise<void> {
  await db.transaction("rw", db.jobs, async () => {
    await chunkedBulkPut(db.jobs, items);
  });
}

export async function bulkUpsertJobCourseReq(items: JobCourseReq[]): Promise<void> {
  await db.transaction("rw", db.jobCourseReq, async () => {
    await chunkedBulkPut(db.jobCourseReq, items);
  });
}

export async function bulkUpsertMasters(
  table: Table<Master, string>,
  items: Master[]
): Promise<void> {
  await db.transaction("rw", table, async () => {
    await chunkedBulkPut(table, items);
  });
}

