import { Express } from 'express';

import { loadApp } from '@loaders/app';

jest.useFakeTimers();
jest.mock('@models/user.model.ts');
jest.mock('@models/experience.model.ts');
jest.mock('@models/feedback.model.ts');
jest.mock('@models/project.model.ts');

const PORT = 3001;

export let app: Express;
beforeAll(async () => {
  app = await loadApp();
});

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterAll(async () => {
  app.listen(PORT).close();
});
