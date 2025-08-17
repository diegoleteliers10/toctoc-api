import { User, type UserRole } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

// 📝 INPUT del caso de uso
export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  password?: string;
}

// 📤 OUTPUT del caso de uso
export interface UpdateUserResponse {
  user: User;
}

// ✏️ CASO DE USO: Actualizar Usuario
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    // 🔍 1. Obtener usuario actual
    const currentUser = await this.userRepository.findById(request.id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // 🛡️ 2. Validar que está activo
    if (!currentUser.isActive) {
      throw new Error('Cannot update inactive user');
    }

    // 🔧 3. Aplicar cambios usando métodos de dominio
    let updatedUser = currentUser;

    if (request.name || request.avatar || request.role || request.email) {
      updatedUser = updatedUser.updateProfile(
        request.name,
        request.avatar,
        request.role,
        request.email,
      );
    }

    if (request.password) {
      updatedUser = updatedUser.changePassword(request.password);
    }

    // 💾 4. Guardar cambios
    const savedUser = await this.userRepository.save(updatedUser);

    // 📤 5. Retornar resultado
    return { user: savedUser };
  }
}
