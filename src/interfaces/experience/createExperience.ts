export interface CreateExperienceRequestBody {
  userId: number;
  companyName: string;
  role: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export interface CreateExperienceResponseBody {
  id: number;
  userId: number;
  companyName: string;
  role: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export const allowedKeysForCreateExperience = {
  userId: 1,
  companyName: 2,
  role: 3,
  startDate: 4,
  endDate: 5,
  description: 6,
};
