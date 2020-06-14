import { ForbiddenException } from '@flagcard/exception';
import { Response, NextFunction } from 'express';
import Token from '../model/token';

interface Headers{
  Authorization?: string,
  authorization?: string,
}
export interface Request {
  subject?: string,
  headers?: Headers
}

export default (req: Request, res: Response, next: NextFunction): void => {
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
};
