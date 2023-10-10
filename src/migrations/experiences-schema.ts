import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.createTable('experiences', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    role: {
      type: new DataTypes.STRING(256),
      allowNull: false,
    },
    description: {
      type: new DataTypes.TEXT('long'),
      allowNull: false,
    },
    company_name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  });
};

export const down: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.dropTable('experiences');
};
