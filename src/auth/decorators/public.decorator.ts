import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
//los decoradores son funciones que se ejecutan antes de que se ejecute la función de la ruta
//lo que ocurrira es que al indicar @Public() en la ruta, se ejecutara el decorador y se ejecutara la función de la ruta
//en este caso se ejecutara este decorador indicando que la ruta es publica, por lo que se ejecutara la función de la ruta
