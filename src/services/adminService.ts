import { createApiService } from './apiService';

// Define the Admin type
export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

const adminService = createApiService<Admin>('/admin');

export default adminService;