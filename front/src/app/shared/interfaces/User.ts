import { Role } from "./Role";

export interface User {
    id: number;
    name: string;
    email: string;
    rol_id: number;
    role: Role
    is_active: boolean;
  }
  
  export interface UserCreate {
    name: string;
    email: string;
    password: string;
    newpassword: string | null;
    rol_id: number;
  }

  export interface UserProfile {
    username: string;
    email: string;
    rol_id: number;
    rol_name: string;
  }
  