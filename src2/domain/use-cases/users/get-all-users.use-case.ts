import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

// 📤 OUTPUT del caso de uso
export interface GetAllUsersResponse {
  users: User[];
}

// 📋 CASO DE USO: Obtener Todos los Usuarios
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<GetAllUsersResponse> {
    // 🔍 1. Obtener todos los usuarios activos
    const users = await this.userRepository.findAllActive();

    // 📤 2. Retornar resultado
    return { users };
  }
}
