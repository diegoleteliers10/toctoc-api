import { User, UserRole } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

// 📝 INPUT del caso de uso
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
}

// 📤 OUTPUT del caso de uso
export interface CreateUserResponse {
  user: User;
}

// 🏭 CASO DE USO: Crear Usuario
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // 🛡️ 1. Validar que el email no exista
    const emailExists = await this.userRepository.existsByEmail(request.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }

    // 🏗️ 2. Crear la entidad de dominio (con validaciones automáticas)
    const user = User.create({
      name: request.name,
      email: request.email,
      password: request.password, // Se encriptará en infrastructure
      role: request.role,
      avatar: request.avatar,
    });

    // 💾 3. Persistir en el repositorio
    const savedUser = await this.userRepository.save(user);

    // 📤 4. Retornar resultado
    return { user: savedUser };
  }
}
