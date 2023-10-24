import { logger } from '@libs/logger';
import { loadApp } from '@loaders/app';
import { redisClient } from '@services/cache/base.cache';

(async () => {
  let counter = 0;
  redisClient.on('error', (err) => {
    logger.error('Redis Client Connection Error', err);
    counter += 1;
    if (counter === 10) {
      redisClient.disconnect();
    }
  });

  await redisClient.connect();

  const app = await loadApp();
  const PORT = 3001;

  app.listen(PORT, () => {
    if (redisClient.isOpen) {
      logger.info('Redis Client Connected');
    }
    logger.info(`Application is running on http://localhost:${PORT}`);
  });
})();
