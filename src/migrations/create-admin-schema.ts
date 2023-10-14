import { MigrationFn } from 'umzug';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

type UserAttributesForDb = {
  first_name: string;
  last_name: string;
  image: string;
  title: string;
  summary: string;
  role: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash('qwerty12345', saltRounds);

  const adminUser: UserAttributesForDb = {
    email: 'test-admin@t.com',
    first_name: 'Admin',
    last_name: 'Test',
    password: hashedPassword,
    role: 'Admin',
    title: 'Test Admin User',
    summary: 'Test admin user for test purposes.',
    image: 'default.png',
    created_at: new Date(),
    updated_at: new Date(),
  };

  await q.bulkInsert('users', [adminUser]);
};

export const down: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.bulkDelete('users', null);
};
