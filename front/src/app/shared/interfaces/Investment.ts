import { Product } from "./Product";

export interface InvestmentCreate {
    product_id: number;
    creation_date: string;
    term: number;
    reinvestment: boolean;
  }
  
  export interface Investment {
    id: number;
    product_id: number;
    products: Product;
    term: number;
    reinvestment: boolean;
    start_date: Date
    end_date: Date
    actual_term: number
    creation_date: string;
    is_active: number
  }