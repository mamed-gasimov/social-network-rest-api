import { Response } from 'express';
import { validationResult } from 'express-validator';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { ExtendedRequest } from '@interfaces/express';
import { HTTP_STATUSES } from '@interfaces/general';
import { logger } from '@libs/logger';

const loginController = async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        logger.error('Invalid credentials');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid credentials' });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.json(error);
        }

        const token = jwt.sign({ user: user.id }, 'some secret string here', { expiresIn: '2d' });
        logger.info('User successfully logged in');
        return res.json({ user, token });
      });
    })(req, res);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default loginController;
