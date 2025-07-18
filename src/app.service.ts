import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInitPage(): string {
    return 'Hello welcome to the Api of Toc Toc House and Apartments renting and buying platform!';
  }
}
