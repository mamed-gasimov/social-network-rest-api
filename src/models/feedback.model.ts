import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { Models } from '@interfaces/general';

interface FeedBackAttributes {
  id: number;
  fromUser: number;
  toUser: number;
  content: string;
  companyName: string;
}

export class FeedBack
  extends Model<FeedBackAttributes, Optional<FeedBackAttributes, 'id'>>
  implements FeedBackAttributes
{
  id: number;

  fromUser: number;

  toUser: number;

  content: string;

  companyName: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    FeedBack.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        fromUser: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        toUser: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        content: {
          type: new DataTypes.TEXT('long'),
          allowNull: false,
        },
        companyName: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
      },
      {
        tableName: 'feedbacks',
        underscored: true,
        sequelize,
      },
    );
  }

  static associate(models: Models, sequelize: Sequelize) {}
}
