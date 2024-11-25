export interface Holydays {
    id: number;
    day: Date;
    is_active: boolean
  }
  
  export interface HolydaysCreate {
    day: string;
  }