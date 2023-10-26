export const mockUser = {
  email: 'test@t.com',
  password: 'test1234',
  firstName: 'Jon',
  lastName: 'Jones',
  summary: 'test',
  title: 'Dev',
};

export const mockResponseUser = {
  id: 12,
  email: 'test@t.com',
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

export const ROUTES = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
  },
  experience: {
    main: '/api/experience',
    withIdParam: '/api/experience/1',
  },
} as const;
