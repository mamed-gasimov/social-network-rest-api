import { createClient } from 'redis';

const PORT = 6379;
const url = 'redis://localhost';

export class CacheService {
  client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient({ url: `${url}:${PORT}` });
  }
}

export const { client: redisClient } = new CacheService();
