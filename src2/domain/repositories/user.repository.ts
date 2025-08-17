import { User } from '../entities/user.entity';

// 🔗 INTERFACE DEL REPOSITORIO (CONTRATO)
// Define QUÉ operaciones podemos hacer, NO CÓMO las hacemos
export interface UserRepository {
  // 🔍 CONSULTAS
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAllActive(): Promise<User[]>;
  existsByEmail(email: string): Promise<boolean>;

  // ✅ COMANDOS
  save(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;

  // 📊 UTILIDADES
  count(): Promise<number>;
  findByRole(role: string): Promise<User[]>;
}
