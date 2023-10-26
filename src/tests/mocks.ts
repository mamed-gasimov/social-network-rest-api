import { UserRole } from '@models/user.model';

export const mockUser = {
  email: 'test@t.com',
  password: 'test1234',
  firstName: 'Jon',
  lastName: 'Jones',
  summary: 'test',
  title: 'Dev',
};

export const payloadCreateUser = { ...mockUser, role: UserRole.User };

export const mockResponseUser = {
  id: 12,
  email: 'test@t.com',
  firstName: 'Jon',
  lastName: 'Jones',
  summary: 'test',
  title: 'Dev',
};

export const mockResponseNewUser = {
  id: '13',
  email: 'test-1@t.com',
  firstName: 'Jon',
  lastName: 'Jones',
  summary: 'test',
  title: 'Dev',
};

export const mockLoginPayload = {
  email: 'test@t.com',
  password: 'test1234',
};

export const mockCreateExperiencePayload = {
  userId: mockResponseUser.id,
  companyName: 'Test',
  role: 'Dev',
  startDate: '10-24-2010',
  endDate: '11-20-2012',
  description: 'some test description',
};

export const mockCreateProjectPayload = {
  userId: mockResponseUser.id,
  image: 'default.png',
  description: 'some test description',
};

export const mockCreateFeedbackPayload = {
  fromUser: mockResponseUser.id,
  toUser: 11,
  companyName: 'Test',
  context: 'some test context description',
};

export const ROUTES = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
  },
  experience: {
    main: '/api/experience',
    withIdParam: '/api/experience/1',
  },
  project: {
    main: '/api/projects',
    withIdParam: '/api/projects/1',
  },
  feedback: {
    main: '/api/feedback',
    withIdParam: '/api/feedback/1',
  },
  user: {
    main: '/api/users',
    withIdParam: '/api/users/1',
  },
} as const;
