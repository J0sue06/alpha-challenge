export interface Product {
  id: number;
  name: string;
  days_less_equal_operating_hour: number;
  days_greater_operating_hour: number;
  days_less_equal_operating_hour_reinvestment: number;
  days_greater_operating_hour_reinvestment: number;
  operating_hour: string;
  is_active: boolean;
}

export interface ProductCreate {
  name: string;
  days_less_equal_operating_hour: number;
  days_greater_operating_hour: number;
  days_less_equal_operating_hour_reinvestment: number;
  days_greater_operating_hour_reinvestment: number;
  operating_hour: string;
}
