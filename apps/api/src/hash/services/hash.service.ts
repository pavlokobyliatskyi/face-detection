import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class HashService {
  async getFileHash(buffer: Buffer): Promise<string> {
    const hash = createHash('sha1');

    // Update the hash with the buffer data
    hash.update(buffer);

    // Calculate the hash digest (hexadecimal representation)
    return hash.digest('hex');
  }
}
