import { addHours, addSeconds, addMinutes } from 'date-fns';
import Token from '../../src/model/token';

describe('Token', () => {
  describe('encode', () => {
    it('should encode with required field with default secret', () => {
      const token = Token.builder()
        .subject('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac')
        .issuedAt(new Date('2020-06-01T12:00:00'))
        .build();

      const result = token.encode();

      expect(result).toEqual('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDZlMGNlMi1kY2Q2LTQxZjUtYmFkZS0wM2M2OGYzZjM4YWMiLCJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE1OTEwMjM2MDAsImV4cCI6MTU5MTAyMzYwNX0.wKHLRZSSK3SfKQA51WmsX_RyH1aSaiEjh-qzGUTt6u_8ISeuCppa-JNxs3T376m9e1zeAxqh_KqEawHcnuvO-A');
    });
    it('should encode with required field with secret', () => {
      const token = Token.builder()
        .subject('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac')
        .issuedAt('2020-06-01T12:00:00')
        .build();

      const result = token.encode('S3CR3T');

      expect(result).toEqual('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDZlMGNlMi1kY2Q2LTQxZjUtYmFkZS0wM2M2OGYzZjM4YWMiLCJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE1OTEwMjM2MDAsImV4cCI6MTU5MTAyMzYwNX0.gybkLn3mAYyCqHoEI3-ou4IaB1KxPQYt2Vn0HpnUtd54os1WY0tSrxhgDL_GdCVFHjVd6rqgh3ILo-Ec5Uhu0A');
    });
  });
  describe('decode', () => {
    it('should decode a token with required fields', () => {
      const issuedAt = new Date();
      const expiration = new Date(issuedAt.getTime() + 5000);
      const result = Token.builder()
        .subject('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac')
        .issuedAt(issuedAt)
        .build()
        .encode();

      const token = Token.decode(result);

      expect(token.subject).toEqual('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac');
      expect(token.issuedAt).toEqual(issuedAt);
      expect(token.expiration).toEqual(expiration);
    });
    it('should decode a token with 3 hours duration', () => {
      const secret = 'HellDoor';
      const issuedAt = new Date();
      issuedAt.setMilliseconds(0);
      const expiration = addHours(issuedAt, 3);
      const result = Token.builder()
        .subject('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac')
        .issuedAt(issuedAt)
        .build()
        .encode({ secret, expiresIn: '3h' });

      const token = Token.decode(result, secret);

      expect(token.subject).toEqual('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac');
      expect(token.issuedAt).toEqual(issuedAt);
      expect(token.expiration).toEqual(expiration);
    });
    it('should decode when token are closed to expire', () => {
      const issuedAt = addSeconds(addMinutes(addHours(new Date(), -2), 59), 58);
      issuedAt.setMilliseconds(0);
      const expiration = addHours(issuedAt, 3);
      const result = Token.builder()
        .subject('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac')
        .issuedAt(issuedAt)
        .build()
        .encode({ expiresIn: '3h' });

      const token = Token.decode(result);

      expect(token.subject).toEqual('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac');
      expect(token.issuedAt).toEqual(issuedAt);
      expect(token.expiration).toEqual(expiration);
    });
    it('should throw error for expired token', () => {
      const issuedAt = new Date(new Date().getTime() - 6000);
      const result = Token.builder()
        .subject('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac')
        .issuedAt(issuedAt)
        .build()
        .encode();

      expect(() => Token.decode(result)).toThrowError('jwt expired');
    });
    it('should throw error when decode with different secret', () => {
      const result = Token.builder()
        .subject('f46e0ce2-dcd6-41f5-bade-03c68f3f38ac')
        .build().encode('S3cR3t');

      expect(() => Token.decode(result)).toThrowError('invalid signature');
    });
  });
});
