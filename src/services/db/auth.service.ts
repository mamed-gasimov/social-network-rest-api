import { UserAttributes } from '@interfaces/users/createUser';
import { User } from '@models/user.model';

export class AuthService {
  private userModel: typeof User;

  constructor(userModel: typeof User) {
    this.userModel = userModel;
  }

  async createUser(user: Omit<UserAttributes, 'id'>) {
    return this.userModel.create(user);
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email: email?.toLowerCase() } });
  }

  async findUserById(id: string) {
    return this.userModel.findOne({ where: { id } });
  }
}
