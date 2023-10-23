export interface ProjectAttributes {
  id: number;
  userId: number;
  image: string;
  description: string;
}

export interface CreateProjectRequestBody {
  userId: number;
  image: string;
  description: string;
}

export const allowedKeysForCreateProject: Record<keyof CreateProjectRequestBody, number> = {
  userId: 1,
  image: 2,
  description: 3,
};
