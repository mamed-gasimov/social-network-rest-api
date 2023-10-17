import { Sequelize, Transaction } from 'sequelize';

import { CreateUserRequestBody } from '@interfaces/users/createUser';
import { User } from '@models/user.model';
import { ExperienceService } from '@services/experience.service';

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
