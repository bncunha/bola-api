import * as bcrypt from 'bcrypt';


export class Encrypt {
  static toHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  static compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}