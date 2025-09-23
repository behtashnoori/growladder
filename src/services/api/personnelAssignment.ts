import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface PersonnelWithAssignment {
  emp_code: string;
  name: string;
  employment_date?: string; // تاریخ استخدام
  job_title_id?: string;
  job_title?: string;
  department_id?: string;
  department_name?: string;
  post_code?: string;
  post_title?: string;
  section_code?: string;
  section_title?: string;
  department_code?: string;
  department_title?: string;
  management_code?: string;
  management_title?: string;
  createdAt: string;
  updatedAt: string;
  orgHistory: PersonOrgHistory[];
}

export interface PersonOrgHistory {
  id: number;
  emp_code: string;
  post_code?: string;
  post_title?: string;
  post_rank_code?: string;
  post_rank_title?: string;
  section_code?: string;
  section_title?: string;
  department_code?: string;
  department_title?: string;
  management_code?: string;
  management_title?: string;
  affiliation?: string;
  from_date: string;
  to_date?: string;
  is_current: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  unitType?: string;
  parentId?: string;
  isIndependent: boolean;
  headRoleAllowed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  code: string;
  title: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationalStructure {
  managements: OrgUnit[];
  departments: OrgUnit[];
  sections: OrgUnit[];
}

export interface AssignPersonnelRequest {
  emp_code: string;
  management_id?: string;
  department_id?: string;
  section_id?: string;
  post_id?: string;
  from_date: string;
  to_date?: string;
  affiliation?: string;
}

export const personnelAssignmentApi = {
  // Get all personnel with their current assignments
  async getAllPersonnel(): Promise<PersonnelWithAssignment[]> {
    const response = await axios.get(`${API_BASE_URL}/api/personnel-assignment`);
    return response.data;
  },

  // Get organizational structure for assignment
  async getOrganizationalStructure(): Promise<OrganizationalStructure> {
    const response = await axios.get(`${API_BASE_URL}/api/personnel-assignment/structure`);
    return response.data;
  },

  // Get departments for a specific management
  async getDepartmentsForManagement(managementId: string): Promise<OrgUnit[]> {
    const response = await axios.get(`${API_BASE_URL}/api/personnel-assignment/departments/${managementId}`);
    return response.data;
  },

  // Get sections for a specific department
  async getSectionsForDepartment(departmentId: string): Promise<OrgUnit[]> {
    const response = await axios.get(`${API_BASE_URL}/api/personnel-assignment/sections/${departmentId}`);
    return response.data;
  },

  // Assign personnel to organizational unit
  async assignPersonnel(data: AssignPersonnelRequest): Promise<{ message: string; assignment: PersonOrgHistory }> {
    const response = await axios.post(`${API_BASE_URL}/api/personnel-assignment/assign`, data);
    return response.data;
  },

  // Get personnel assignment history
  async getPersonnelHistory(emp_code: string): Promise<PersonOrgHistory[]> {
    const response = await axios.get(`${API_BASE_URL}/api/personnel-assignment/history/${emp_code}`);
    return response.data;
  },

  // Get all posts for assignment
  async getAllPosts(): Promise<Post[]> {
    const response = await axios.get(`${API_BASE_URL}/api/posts`);
    return response.data.items || response.data;
  }
};
