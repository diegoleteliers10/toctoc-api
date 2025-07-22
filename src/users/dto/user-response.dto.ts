export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  //no se agrega password por seguridad
}
