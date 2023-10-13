import { User, UserAttributes } from '@models/user.model';

export class AuthService {
  private userModel: typeof User;

  constructor(userModel: typeof User) {
    this.userModel = userModel;
  }

  async createUser(user: Omit<UserAttributes, 'id'>) {
    return this.userModel.create(user);
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email: email.toLowerCase() } });
  }
}
