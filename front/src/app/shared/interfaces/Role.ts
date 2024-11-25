export interface Role {
  id: number;
  name: string;
  description: string | null; 
  is_active: boolean
}

export interface RoleCreate {
  name: string;
  description: string | null; 
}