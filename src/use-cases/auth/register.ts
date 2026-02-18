import { UserRepository } from '../../repositories/user.repository.interface';
import { hashPassword } from '../../utils/helper';
import { AppError } from '../../utils/error';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password, role }: RegisterRequest) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}