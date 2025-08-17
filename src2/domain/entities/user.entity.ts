export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
    this.validate();
  }

  // 🧩 GETTERS (Acceso a propiedades)
  get id(): string | undefined {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get email(): string {
    return this.props.email;
  }
  get password(): string {
    return this.props.password;
  }
  get avatar(): string | undefined {
    return this.props.avatar;
  }
  get role(): UserRole {
    return this.props.role;
  }
  get isActive(): boolean {
    return this.props.isActive!;
  }
  get createdAt(): Date {
    return this.props.createdAt!;
  }
  get updatedAt(): Date {
    return this.props.updatedAt!;
  }
  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  // 🔧 MÉTODOS DE NEGOCIO (Lógica pura)
  updateProfile(
    name?: string,
    avatar?: string,
    role?: UserRole,
    email?: string,
  ): User {
    return new User({
      ...this.props,
      name: name ?? this.props.name,
      avatar: avatar ?? this.props.avatar,
      role: role ?? this.props.role,
      email: email ?? this.props.email,
      updatedAt: new Date(),
    });
  }

  changePassword(newPassword: string): User {
    this.validatePassword(newPassword);
    return new User({
      ...this.props,
      password: newPassword,
      updatedAt: new Date(),
    });
  }

  deactivate(): User {
    return new User({
      ...this.props,
      isActive: false,
      deletedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  activate(): User {
    return new User({
      ...this.props,
      isActive: true,
      deletedAt: undefined,
      updatedAt: new Date(),
    });
  }

  // 🛡️ VALIDACIONES DE DOMINIO
  private validate(): void {
    if (!this.props.name || this.props.name.trim().length < 2) {
      throw new Error('User name must be at least 2 characters long');
    }

    if (!this.props.email || !this.isValidEmail(this.props.email)) {
      throw new Error('User email must be valid');
    }

    this.validatePassword(this.props.password);

    if (!Object.values(UserRole).includes(this.props.role)) {
      throw new Error('User role must be valid');
    }
  }

  private validatePassword(password: string): void {
    // Debe tener entre 9 y 15 caracteres, al menos una mayúscula y un caracter especial de ?_#$%^&
    const passwordRegex = /^(?=.*[A-Z])(?=.*[?_#$%^&])[A-Za-z\d?_#$%^&]{9,15}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        'User password must be 9-15 characters, include at least one uppercase letter, and one special character (? _ # $ % ^ &)',
      );
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 🔄 CONVERSIÓN A OBJETO PLANO (para persistencia)
  toPlainObject(): UserProps {
    return { ...this.props };
  }

  // 🏭 FACTORY METHODS
  static create(
    props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): User {
    return new User(props);
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  // 🔐 UTILIDADES
  toResponseWithoutPassword(): Omit<UserProps, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this.props;
    return userWithoutPassword;
  }
}
