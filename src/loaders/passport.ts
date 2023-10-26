import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';

import { Loader } from '@interfaces/general';
import { MockStrategy } from '@tests/mockStrategy';

let Strategy = JWTStrategy;
if (process.env.NODE_ENV === 'test') {
  Strategy = MockStrategy as unknown as typeof JWTStrategy;
}

export const loadPassport: Loader = (_app, context) => {
  const {
    services: { authService },
  } = context;

  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'some secret string here',
      },
      async (jwtPayload, done) => {
        try {
          const user = await authService.findUserById(jwtPayload.user);

          if (!user) {
            return done(null, null);
          }

          const { id, role } = user;
          done(null, { id, role });
        } catch (e) {
          done(e);
        }
      },
    ),
  );

  passport.use(
    new LocalStrategy.Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await authService.findUserByEmail(email);
          const doesPasswordsMatch = await bcrypt.compare(password, user.password);

          if (!doesPasswordsMatch) {
            return done(null, false, {
              message: 'Invalid credentials!',
            });
          }

          const { firstName, lastName, summary, title, id, email: userEmail, image } = user;
          const userData = { firstName, lastName, summary, title, id, email: userEmail, image };

          return done(null, userData, {
            message: 'User logged in successfully!',
          });
        } catch (e) {
          return done(e);
        }
      },
    ),
  );
};
