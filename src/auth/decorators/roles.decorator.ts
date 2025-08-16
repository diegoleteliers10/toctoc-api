import { SetMetadata } from '@nestjs/common';
import { User } from '../../users/entities/users.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: User['role'][]) =>
  SetMetadata(ROLES_KEY, roles);
//los decoradores son funciones que se ejecutan antes de que se ejecute la función de la ruta
//lo que ocurrira es que al indicar @Roles() en la ruta, se ejecutara el decorador y se ejecutara la función de la ruta
//en este caso se ejecutara el decorador indicando que la ruta es privada, por lo que se realizara la comprobación de roles
