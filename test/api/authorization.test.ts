import sinon, { SinonSpy } from 'sinon';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { addSeconds } from 'date-fns';
import config, { secret } from '../../config';
import authorization, { Request } from '../../src/api/authorization';
import Token from '../../src/model/token';

describe('Auth Token', () => {
  const req: Request = {};
  req.headers = {};
  const res: Partial<Response> = {};
  const next: SinonSpy = sinon.fake();
  sinon.createSandbox().stub(config, 'isProduction').returns(true);
  it('should return ForbiddenException if no auth-token provider', () => {
    expect(() => authorization(<Request>req, <Response>res, next))
      .toThrowError('Authorization token is not prensent in header');
  });
  it('should return ForbiddenException if decoded token has no user_id', () => {
    const token = jwt.sign({}, secret(), { algorithm: 'HS512' });

    const headers = {
      authorization: `Bearer ${token}`,
    };

    expect(() => authorization({ headers }, <Response>res, next))
      .toThrowError('It is highly recommended to inform the sub field');
  });
  it('should return ForbiddenException if a token was decoded with another secret', () => {
    const token = Token.builder()
      .subject('b36d21fe-123f-4258-86d4-ed063b74414c')
      .build().encode('another-secret');

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    expect(() => authorization({ headers }, <Response>res, next))
      .toThrowError('invalid signature');
  });
  it('should return ForbiddenException if a token was expired', () => {
    const token = Token.builder()
      .subject('b36d21fe-123f-4258-86d4-ed063b74414c')
      .issuedAt(addSeconds(new Date(), -6))
      .build()
      .encode();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    expect(() => authorization({ headers }, <Response>res, next))
      .toThrowError('jwt expired');
  });
  it('req should have payload property', () => {
    const token = Token.builder()
      .subject('b36d21fe-123f-4258-86d4-ed063b74414c')
      .build().encode();

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const request: Request = { headers };

    authorization(request, <Response>res, next);

    expect(request.subject).toEqual('b36d21fe-123f-4258-86d4-ed063b74414c');
  });
});
