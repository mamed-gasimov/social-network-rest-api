export interface FeedBackAttributes {
  id: number;
  fromUser: number;
  toUser: number;
  context: string;
  companyName: string;
}

export interface CreateFeedbackRequestBody {
  fromUser: number;
  companyName: string;
  toUser: number;
  context: string;
}

export const allowedKeysForCreateFeedback = {
  fromUser: 1,
  companyName: 2,
  toUser: 3,
  context: 4,
};
