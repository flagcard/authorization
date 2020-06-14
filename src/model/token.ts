import { ForbiddenException } from '@flagcard/exception';
import jwt from 'jsonwebtoken';
import TokenBuilder from './token.builder';
import { TokenOptions } from './token.options';
import { secret } from '../../config';

const algorithm = 'HS512';

interface EncodeOptions{
  secret?: string,
  expiresIn?: string | number
}

export default class Token {
  public audience:string;

  public issuer:string;

  public subject:string;

  public iat:number;

  public issuedAt:Date;

  public expiration?:Date;

  constructor(options: TokenOptions) {
    this.audience = options.aud;
    this.issuer = options.iss;
    this.subject = options.sub;
    this.iat = options.iat;
    this.issuedAt = new Date(options.iat * 1000);
    this.expiration = options.exp !== 0 ? new Date(options.exp * 1000) : undefined;
    this.validate();
  }

  public static decode(token:string, passphrase?:string): Token {
    const key = secret(passphrase);
    let encoded = token;
    if (token.startsWith('Bearer')) {
      encoded = token.substring(7);
    }
    const decoded = jwt.verify(encoded, key, { algorithms: [algorithm] });
    return new Token(decoded as TokenOptions);
  }

  public encode(option?: EncodeOptions | string): string {
    let passphrase;
    let expiresIn:number | string = 5;
    if (option) {
      if (typeof option === 'string') {
        passphrase = option;
      } else {
        const encodeOptions = option as EncodeOptions;
        passphrase = encodeOptions.secret;
        expiresIn = encodeOptions.expiresIn || 5;
      }
    }
    const key = secret(passphrase);
    const payload = {
      sub: this.subject,
      iss: this.issuer,
      aud: this.audience,
      iat: this.iat,
    };
    return jwt.sign(payload, key, { algorithm, expiresIn });
  }

  validate(): void {
    if (!this.subject) {
      throw new ForbiddenException('It is highly recommended to inform the sub field');
    }
  }

  public static builder(): TokenBuilder {
    return new TokenBuilder();
  }
}
