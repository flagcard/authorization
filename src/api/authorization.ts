import { ForbiddenException } from '@flagcard/exception';
import { Response, NextFunction } from 'express';
import Token from '../model/token';
import config from '../../config';

interface Headers{
  Authorization?: string,
  authorization?: string,
}
export interface Request {
  subject?: string,
  headers?: Headers
}

export default (req: Request, res: Response, next: NextFunction): void => {
  if (config.isProduction()) {
    const authorization = req.headers?.authorization || req.headers?.Authorization;
    if (authorization) {
      try {
        req.subject = Token.decode(authorization).subject;
        next();
      } catch (e) {
        throw new ForbiddenException(e.message);
      }
    } else {
      throw new ForbiddenException('Authorization token is not prensent in header');
    }
  } else {
    req.subject = 'e9fd456a-599c-4942-b249-fc457bb4b278';
    next();
  }
};
