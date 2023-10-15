import { User } from '@models/user.model';

export class UsersService {
  private userModel: typeof User;

  constructor(userModel: typeof User) {
    this.userModel = userModel;
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

  async deleteUser(id: number) {
    return this.userModel.destroy({
      where: { id },
    });
  }
}
