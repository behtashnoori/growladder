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

class GrowLadderDB extends Dexie {
  public courses!: Table<Course, string>;
  public personnel!: Table<Personnel, string>;
  public coursePersonnel!: Table<CoursePersonnel, [string, string]>;
  public jobs!: Table<Job, string>;
  public jobCourseReq!: Table<JobCourseReq, [string, string]>;

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

