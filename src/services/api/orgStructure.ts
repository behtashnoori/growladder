import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

export interface OrgUnit {
  id: string;
  name: string;
  unitType: 'management' | 'department' | 'section';
  parentId?: string | null;
  isIndependent: boolean;
  headRoleAllowed: boolean;
  createdAt: string;
  updatedAt: string;
  children?: OrgUnit[];
}

export interface OrgTreeResponse {
  tree: OrgUnit[];
}

export interface AvailableUnitsResponse {
  units: OrgUnit[];
}

export interface MoveUnitRequest {
  unitId: string;
  newParentId: string | null;
}

export interface InitializeResponse {
  message: string;
  counts: {
    managements: number;
    independentDepartments: number;
    sections: number;
  };
}

export const orgStructureApi = {
  async getTree(): Promise<OrgTreeResponse> {
    const response = await axios.get(`${API_BASE_URL}/api/org-structure/tree`);
    return response.data;
  },

  async getAvailableUnits(unitType?: string, excludeId?: string): Promise<AvailableUnitsResponse> {
    const params: any = {};
    if (unitType) params.unitType = unitType;
    if (excludeId) params.excludeId = excludeId;
    
    const response = await axios.get(`${API_BASE_URL}/api/org-structure/available`, { params });
    return response.data;
  },

  async createUnit(data: {
    name: string;
    unitType: 'management' | 'department' | 'section';
    parentId?: string;
    isIndependent?: boolean;
    headRoleAllowed?: boolean;
  }): Promise<OrgUnit> {
    const response = await axios.post(`${API_BASE_URL}/api/org-structure`, data);
    return response.data;
  },

  async updateUnit(id: string, data: Partial<OrgUnit>): Promise<OrgUnit> {
    const response = await axios.put(`${API_BASE_URL}/api/org-structure/${id}`, data);
    return response.data;
  },

  async moveUnit(data: MoveUnitRequest): Promise<OrgUnit> {
    const response = await axios.post(`${API_BASE_URL}/api/org-structure/move`, data);
    return response.data;
  },

  async deleteUnit(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/org-structure/${id}`);
  },

  async initialize(): Promise<InitializeResponse> {
    const response = await axios.post(`${API_BASE_URL}/api/org-structure/initialize`);
    return response.data;
  }
};
