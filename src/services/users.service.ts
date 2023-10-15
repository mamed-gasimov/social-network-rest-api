import { User } from '@models/user.model';

export class UsersService {
  private userModel: typeof User;

  constructor(userModel: typeof User) {
    this.userModel = userModel;
  }

  async findAll(selectFields: string[], offset: number, limit: number) {
    return this.userModel.findAndCountAll({
      attributes: selectFields,
      offset,
      limit,
      order: [['id', 'DESC']],
    });
  }
}
