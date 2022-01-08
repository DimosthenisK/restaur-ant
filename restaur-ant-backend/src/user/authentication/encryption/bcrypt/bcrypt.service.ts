import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class BcryptService {
  async hash(password: string) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  async compare(password: string, encrypted: string) {
    return await compare(password, encrypted);
  }
}
