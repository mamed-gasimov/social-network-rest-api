import { logger } from '@libs/logger';
import { loadApp } from '@loaders/app';

(async () => {
  const app = await loadApp();
  const PORT = 3001;

  app.listen(PORT, () => logger.info(`Application is running on http://localhost:${PORT}`));
})();
