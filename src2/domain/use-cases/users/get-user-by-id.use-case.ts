import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

// 📝 INPUT del caso de uso
export interface GetUserByIdRequest {
  id: string;
}

// 📤 OUTPUT del caso de uso
export interface GetUserByIdResponse {
  user: User;
}

// 🔍 CASO DE USO: Obtener Usuario por ID
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    // 🔍 1. Buscar usuario
    const user = await this.userRepository.findById(request.id);

    // 🛡️ 2. Validar que existe
    if (!user) {
      throw new Error('User not found');
    }

    // 🚫 3. Validar que está activo
    if (!user.isActive) {
      throw new Error('User is not active');
    }

    // 📤 4. Retornar resultado
    return { user };
  }
}
