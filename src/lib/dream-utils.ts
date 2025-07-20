export interface Dream {
  id: string;
  title: string;
  content: string;
  date: Date;
  isLucid: boolean;
  clarity: number; // A rating from 1 to 10
} 