import { User } from '@models/user.model';

export interface CVResponse {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  image: string;
  summary: string;
  email: string;
  experiences: {
    userId: number;
    companyName: string;
    role: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];
  projects: {
    id: number;
    userId: number;
    image: string;
    description: string;
  }[];
  feedbacks: {
    id: number;
    fromUser: number;
    companyName: string;
    toUser: number;
    context: string;
  }[];
}

export interface UserCV extends User {
  experiences: {
    userId: number;
    companyName: string;
    role: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];
  feedbacks: { id: number; fromUser: number; companyName: string; toUser: number; context: string }[];
  projects: { id: number; userId: number; image: string; description: string }[];
}
