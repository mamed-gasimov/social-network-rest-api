import { Sequelize, Transaction } from 'sequelize';

import { CreateUserRequestBody } from '@interfaces/users/createUser';
import { User } from '@models/user.model';
import { ExperienceService } from '@services/experience.service';
import { Experience } from '@models/experience.model';
import { FeedBack } from '@models/feedback.model';
import { allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';
import { allowedKeysForCreateFeedback } from '@interfaces/feedback/createFeedback';
import { Project } from '@models/project.model';
import { allowedKeysForCreateProject } from '@interfaces/projects/createProject';

export class UsersService {
  private userModel: typeof User;

  private sequalize: Sequelize;

  constructor(userModel: typeof User, sequalize: Sequelize) {
    this.userModel = userModel;
    this.sequalize = sequalize;
  }

  async getUsers(selectFields: string[], offset: number, limit: number) {
    return this.userModel.findAndCountAll({
      attributes: selectFields,
      offset,
      limit,
      order: [['id', 'DESC']],
    });
  }

  async getUser(selectFields: string[], id: number) {
    return this.userModel.findOne({
      where: { id },
      attributes: selectFields,
    });
  }

  async getUserCV(id: number) {
    return this.userModel.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'role', 'password'],
      },
      include: [
        {
          model: Experience,
          as: 'experiences',
          attributes: ['id', ...Object.keys(allowedKeysForCreateExperience)],
          order: [['id', 'DESC']],
        },
        {
          model: FeedBack,
          as: 'feedbacks',
          attributes: ['id', ...Object.keys(allowedKeysForCreateFeedback)],
          order: [['id', 'DESC']],
        },
        {
          model: Project,
          as: 'projects',
          attributes: ['id', ...Object.keys(allowedKeysForCreateProject)],
          order: [['id', 'DESC']],
        },
      ],
    });
  }

  async updateUser(id: number, data: CreateUserRequestBody) {
    return this.userModel.update(data, {
      where: { id },
    });
  }

  async deleteUser(id: number, experienceService: ExperienceService) {
    let transactionDeleteUser: Transaction;
    try {
      transactionDeleteUser = await this.sequalize.transaction();
      await experienceService.deleteUserExperiences(id, transactionDeleteUser);
      await this.userModel.destroy({
        where: { id },
        transaction: transactionDeleteUser,
      });
      return transactionDeleteUser.commit();
    } catch (error) {
      await transactionDeleteUser.rollback();
    }
  }
}
