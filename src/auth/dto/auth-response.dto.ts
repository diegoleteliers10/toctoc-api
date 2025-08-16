import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/users.entity';

export class AuthResponseDto {
  @ApiProperty({ type: User })
  user: Omit<User, 'password'>; //Omit es una clase de typescript que permite omitir propiedades de un objeto

  @ApiProperty({ type: String })
  access_token: string;
}
