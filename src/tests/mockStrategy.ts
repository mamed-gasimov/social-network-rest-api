import passport from 'passport';
import util from 'util';
import { mockResponseUser } from './mocks';

export function MockStrategy(options: { payload: unknown }, verify: Function) {
  passport.Strategy.call(this);
  this.name = 'jwt';

  if (options.payload) {
    this._payload = options.payload;
  } else {
    this._payload = {
      user: {
        email: mockResponseUser.email,
      },
    };
  }

  this._verify = verify;
  if (!this._verify) {
    throw new TypeError('JwtStrategy requires a verify callback');
  }
}
util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function (_req: Request, _options: unknown) {
  let self = this;

  let verified = function (err: Error, user: unknown, info: unknown) {
    if (err) {
      return self.error(err);
    } else if (!user) {
      return self.fail(info);
    } else {
      return self.success(user, info);
    }
  };
  try {
    self._verify(this._payload, verified);
  } catch (ex) {
    self.error(ex);
  }
};
