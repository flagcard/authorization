import Token from './token';
import { TokenOptions } from './token.options';

export default class TokenBuilder {
  private options: TokenOptions = {
    aud: '',
    iss: '',
    sub: '',
    iat: 0,
    exp: 0,
  };

  public audience(audience:string): this{
    this.options.aud = audience;
    return this;
  }

  public issuer(issuer:string): this{
    this.options.iss = issuer;
    return this;
  }

  public subject(subject:string): this{
    this.options.sub = subject;
    return this;
  }

  public issuedAt(issuedAt:Date | string): this{
    const iat = typeof issuedAt === 'string' ? new Date(issuedAt) : issuedAt;
    this.options.iat = iat.getTime() / 1000;
    return this;
  }

  public build(): Token {
    if (!this.options.sub) {
      throw new Error('It is highly recommended to inform the subject');
    }
    if (this.options.iat === 0) {
      this.issuedAt(new Date());
    }
    return new Token(this.options);
  }
}
