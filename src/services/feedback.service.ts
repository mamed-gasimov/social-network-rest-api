import { CreateFeedbackRequestBody } from '@interfaces/feedback/createFeedback';
import { FeedBack, FeedBackAttributes } from '@models/feedback.model';

export class FeedbackService {
  private feedbackModel: typeof FeedBack;

  constructor(feedbackModel: typeof FeedBack) {
    this.feedbackModel = feedbackModel;
  }

  async createFeedback(feedback: Omit<FeedBackAttributes, 'id'>) {
    this.feedbackModel.create(feedback);
  }

  async getFeedbacks(selectFields: string[], offset: number, limit: number) {
    return this.feedbackModel.findAndCountAll({
      attributes: selectFields,
      offset,
      limit,
      order: [['id', 'DESC']],
    });
  }

  async getFeedbackById(selectFields: string[], id: number) {
    return this.feedbackModel.findOne({
      where: { id },
      attributes: selectFields,
    });
  }

  async updateFeedback(id: number, data: CreateFeedbackRequestBody) {
    return this.feedbackModel.update(data, {
      where: { id },
    });
  }

  async deleteFeedbackById(id: number) {
    return this.feedbackModel.destroy({
      where: { id },
    });
  }
}
