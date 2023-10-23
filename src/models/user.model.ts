import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { Models } from '@interfaces/general';
import { UserAttributes } from '@interfaces/users/createUser';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export class User extends Model<UserAttributes, Optional<UserAttributes, 'id'>> implements UserAttributes {
  id: number;

  firstName: string;

  lastName: string;

  image: string;

  title: string;

  summary: string;

  role: UserRole;

  email: string;

  password: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          field: 'first_name',
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        lastName: {
          field: 'last_name',
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        image: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        title: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        summary: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        role: {
          type: new DataTypes.STRING(50),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: 'users',
        underscored: true,
        timestamps: true,
        sequelize,
      },
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    User.hasMany(models.project, {
      foreignKey: 'user_id',
      as: 'projects',
    });

    User.hasMany(models.experience, {
      foreignKey: 'user_id',
      as: 'experiences',
    });

    User.hasMany(models.feedback, {
      foreignKey: 'to_user',
      as: 'feedbacks',
    });

    User.hasMany(models.feedback, {
      foreignKey: 'from_user',
    });

    sequelize.sync();
  }
}
