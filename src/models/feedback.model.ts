import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { Models } from '@interfaces/general';

export interface FeedBackAttributes {
  id: number;
  fromUser: number;
  toUser: number;
  context: string;
  companyName: string;
}

export class FeedBack
  extends Model<FeedBackAttributes, Optional<FeedBackAttributes, 'id'>>
  implements FeedBackAttributes
{
  id: number;

  fromUser: number;

  toUser: number;

  context: string;

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
          field: 'from_user',
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        toUser: {
          field: 'to_user',
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        context: {
          type: new DataTypes.TEXT('long'),
          allowNull: false,
        },
        companyName: {
          field: 'company_name',
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
      },
      {
        tableName: 'feedbacks',
        underscored: true,
        timestamps: true,
        sequelize,
      },
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    FeedBack.belongsTo(models.user, {
      foreignKey: 'from_user',
    });

    FeedBack.belongsTo(models.user, {
      foreignKey: 'to_user',
    });

    sequelize.sync();
  }
}
