import { UserRepository } from '../../repositories/user.repository';

// 📝 INPUT del caso de uso
export interface DeleteUserRequest {
  id: string;
}

// 🗑️ CASO DE USO: Eliminar Usuario (Soft Delete)
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: DeleteUserRequest): Promise<void> {
    // 🔍 1. Obtener usuario actual
    const currentUser = await this.userRepository.findById(request.id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // 🛡️ 2. Validar que no esté ya eliminado
    if (!currentUser.isActive) {
      throw new Error('User is already deleted');
    }

    // 🔧 3. Desactivar usando método de dominio
    const deactivatedUser = currentUser.deactivate();

    // 💾 4. Guardar cambios
    await this.userRepository.save(deactivatedUser);
  }
}
