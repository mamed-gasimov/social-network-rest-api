import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { ExtendedRequest } from '@interfaces/express';
import { HTTP_STATUSES } from '@interfaces/general';
import { logger } from '@libs/logger';
import { CustomError } from '@helpers/customError';

const loginController = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const msg = errors.array()?.[0]?.msg;
      const error = new CustomError(HTTP_STATUSES.BAD_REQUEST, msg);
      return next(error);
    }

    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        const error = new CustomError(HTTP_STATUSES.BAD_REQUEST, 'Invalid credentials');
        return next(error);
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.json({ message: error.message });
        }

        const token = jwt.sign({ user: user?.id }, 'some secret string here', { expiresIn: '2d' });
        logger.info('User successfully logged in');
        return res.json({ user, token });
      });
    })(req, res);
  } catch (error) {
    const err = new CustomError(
      HTTP_STATUSES.INTERNAL_SERVER_ERROR,
      error.message,
      'Something went wrong on the server.',
    );
    next(err);
  }
};

export default loginController;
