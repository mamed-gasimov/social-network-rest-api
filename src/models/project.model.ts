import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { Models } from '@interfaces/general';

interface ProjectAttributes {
  id: number;
  userId: number;
  image: string;
  description: string;
}

export class Project extends Model<ProjectAttributes, Optional<ProjectAttributes, 'id'>> implements ProjectAttributes {
  id: number;

  userId: number;

  image: string;

  description: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    Project.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        image: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        description: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        tableName: 'projects',
        underscored: true,
        sequelize,
      },
    );
  }

  static associate(models: Models, sequelize: Sequelize) {}
}
