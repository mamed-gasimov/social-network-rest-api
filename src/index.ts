import { logger } from '@libs/logger';
import { loadApp } from '@loaders/app';

(async () => {
  const app = await loadApp();

  app.listen(3001, () => logger.info('Application is running on http://localhost:3001'));
})();
