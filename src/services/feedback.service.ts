import { FeedBack, FeedBackAttributes } from '@models/feedback.model';

export class FeedbackService {
  private feedbackModel: typeof FeedBack;

  constructor(feedbackModel: typeof FeedBack) {
    this.feedbackModel = feedbackModel;
  }

  async createFeedback(feedback: Omit<FeedBackAttributes, 'id'>) {
    this.feedbackModel.create(feedback);
  }
}
