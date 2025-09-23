import { OrgUnit, ROOT_ORG_ID } from "@/types/org-unit";
import { personnelApi, Personnel } from "./services/api/personnel";
import { courseApi, Course } from "./services/api/courses";
import { jobApi, Job } from "./services/api/jobs";

// Re-export types for compatibility
export type { Personnel, Course, Job };

export interface CoursePersonnel {
  emp_code: string;
  course_code: string;
  createdAt: number;
}

export interface PersonCourse {
  emp_code: string;
  course_code: string;
  status?: "passed" | "in_progress" | "failed";
  attendancePercent?: number;
  absencePercent?: number;
  hours?: number;
  from?: string;
  to?: string;
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

export interface PersonOrgHistory {
  id?: number;
  emp_code: string;
  post_code?: string;
  post_title?: string;
  section_code?: string;
  section_title?: string;
  department_code?: string;
  department_title?: string;
  management_code?: string;
  management_title?: string;
  affiliation?: string;
  from: string;
  to?: string;
  createdAt: number;
  updatedAt: number;
}

// API-based data functions
export async function getCourses(recentSince?: number): Promise<Course[]> {
  try {
    const response = await courseApi.getAll();
    let items = response.items || [];
    
    if (recentSince) {
      items = items.filter((c) => new Date(c.createdAt).getTime() >= recentSince);
    }
    
    return items;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function bulkUpsertCourses(items: Course[]): Promise<void> {
  try {
    // Get existing courses to determine which ones to update vs create
    const existingResponse = await courseApi.getAll({ pageSize: 10000 });
    const existingMap = new Map(existingResponse.items.map(c => [c.code, c]));
    
    const toCreate: Omit<Course, 'createdAt' | 'updatedAt'>[] = [];
    const toUpdate: { code: string; data: Partial<Course> }[] = [];
    
    for (const item of items) {
      const existing = existingMap.get(item.code);
      if (existing) {
        // Check if there are any changes
        const hasChanges = 
          existing.title !== item.title ||
          existing.category !== item.category;
        
        if (hasChanges) {
          toUpdate.push({
            code: item.code,
            data: {
              title: item.title,
              category: item.category,
            }
          });
        }
      } else {
        toCreate.push({
          code: item.code,
          title: item.title,
          category: item.category,
        });
      }
    }
    
    // Create new records
    if (toCreate.length > 0) {
      try {
        await courseApi.bulkCreate(toCreate);
      } catch (error) {
        console.error('Failed to bulk create courses:', error);
        // Fallback to individual creation
        for (const course of toCreate) {
          try {
            await courseApi.create(course);
          } catch (createError) {
            console.error(`Failed to create course ${course.code}:`, createError);
          }
        }
      }
    }
    
    // Update existing records
    for (const update of toUpdate) {
      try {
        await courseApi.update(update.code, update.data);
      } catch (error) {
        console.error(`Failed to update course ${update.code}:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error bulk upserting courses:', error);
    throw error; // Re-throw to let the UI handle the error
  }
}

export async function getPersonnel(recentSince?: number): Promise<Personnel[]> {
  try {
    const response = await personnelApi.getAll();
    let items = response.items || [];
    
    if (recentSince) {
      items = items.filter((p) => new Date(p.createdAt).getTime() >= recentSince);
    }
    
    return items;
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return [];
  }
}

export async function bulkUpsertPersonnel(items: Personnel[]): Promise<void> {
  try {
    // First, try to get existing personnel to determine which ones to update vs create
    const existingResponse = await personnelApi.getAll({ pageSize: 10000 });
    const existingMap = new Map(existingResponse.items.map(p => [p.emp_code, p]));
    
    const toCreate: Omit<Personnel, 'createdAt' | 'updatedAt'>[] = [];
    const toUpdate: { emp_code: string; data: Partial<Personnel> }[] = [];
    
    for (const item of items) {
      const existing = existingMap.get(item.emp_code);
      if (existing) {
        // Check if there are any changes
        const hasChanges = 
          existing.name !== item.name ||
          existing.job_title !== item.job_title ||
          existing.department_name !== item.department_name ||
          existing.post_title !== item.post_title ||
          existing.section_title !== item.section_title ||
          existing.department_title !== item.department_title ||
          existing.management_title !== item.management_title;
        
        if (hasChanges) {
          toUpdate.push({
            emp_code: item.emp_code,
            data: {
              name: item.name,
              job_title: item.job_title,
              department_name: item.department_name,
              post_title: item.post_title,
              section_title: item.section_title,
              department_title: item.department_title,
              management_title: item.management_title,
              job_title_id: item.job_title_id,
              department_id: item.department_id,
              post_code: item.post_code,
              section_code: item.section_code,
              department_code: item.department_code,
              management_code: item.management_code,
            }
          });
        }
      } else {
        toCreate.push({
          emp_code: item.emp_code,
          name: item.name,
          job_title: item.job_title,
          department_name: item.department_name,
          post_title: item.post_title,
          section_title: item.section_title,
          department_title: item.department_title,
          management_title: item.management_title,
          job_title_id: item.job_title_id,
          department_id: item.department_id,
          post_code: item.post_code,
          section_code: item.section_code,
          department_code: item.department_code,
          management_code: item.management_code,
        });
      }
    }
    
    // Create new records
    if (toCreate.length > 0) {
      await personnelApi.bulkCreate(toCreate);
    }
    
    // Update existing records
    for (const update of toUpdate) {
      await personnelApi.update(update.emp_code, update.data);
    }
    
  } catch (error) {
    console.error('Error bulk upserting personnel:', error);
    throw error; // Re-throw to let the UI handle the error
  }
}

export async function getPersonCourses(emp_code: string): Promise<PersonCourse[]> {
  // TODO: Implement this when backend API is ready
  console.log('getPersonCourses not yet implemented for API');
  return [];
}

export async function getJobs(recentSince?: number): Promise<Job[]> {
  try {
    const response = await jobApi.getAll();
    let items = response.items || [];
    
    if (recentSince) {
      items = items.filter((j) => new Date(j.createdAt).getTime() >= recentSince);
    }
    
    return items;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getJobCourseReq(job_title_id: string): Promise<JobCourseReq[]> {
  // TODO: Implement this when backend API is ready
  console.log('getJobCourseReq not yet implemented for API');
  return [];
}

export async function bulkUpsertJobs(items: Job[]): Promise<void> {
  try {
    await jobApi.bulkCreate(items);
  } catch (error) {
    console.error('Error bulk upserting jobs:', error);
  }
}

export async function bulkUpsertJobCourseReq(items: JobCourseReq[]): Promise<void> {
  // TODO: Implement this when backend API is ready
  console.log('JobCourseReq bulk upsert not yet implemented for API');
}

export async function bulkUpsertMasters(table: string, items: Master[]): Promise<void> {
  // For now, we'll use a simple approach since master data APIs might not be fully implemented
  console.log(`bulkUpsertMasters for ${table} with ${items.length} items - using placeholder implementation`);
  
  // This is a placeholder implementation
  // In a real scenario, you would need to implement the specific API endpoints for each master data type
  // (posts, sections, departments, managements, etc.)
  
  try {
    // For now, just log the data that would be processed
    console.log(`Would process ${items.length} ${table} items:`, items.slice(0, 3));
    
    // TODO: Implement actual API calls based on table type
    // switch (table) {
    //   case 'posts':
    //     await postApi.bulkCreate(items);
    //     break;
    //   case 'sections':
    //     await sectionApi.bulkCreate(items);
    //     break;
    //   // etc.
    // }
    
  } catch (error) {
    console.error(`Error bulk upserting ${table}:`, error);
    throw error;
  }
}

export async function getOrgUnits(options?: {
  isIndependent?: boolean;
}): Promise<OrgUnit[]> {
  // TODO: Implement this when backend API is ready
  console.log('getOrgUnits not yet implemented for API');
  return [];
}

export async function upsertOrgUnit(unit: OrgUnit): Promise<void> {
  // TODO: Implement this when backend API is ready
  console.log('upsertOrgUnit not yet implemented for API');
}

// Legacy compatibility - these functions are no longer needed but kept for compatibility
export const db = {
  courses: {
    toArray: () => getCourses(),
    bulkPut: (items: Course[]) => bulkUpsertCourses(items)
  },
  personnel: {
    toArray: () => getPersonnel(),
    bulkPut: (items: Personnel[]) => bulkUpsertPersonnel(items)
  },
  jobs: {
    toArray: () => getJobs(),
    bulkPut: (items: Job[]) => bulkUpsertJobs(items)
  },
  personCourse: {
    where: (query: any) => ({
      toArray: () => getPersonCourses(query.emp_code)
    })
  },
  orgUnits: {
    toArray: () => getOrgUnits(),
    put: (unit: OrgUnit) => upsertOrgUnit(unit)
  }
};