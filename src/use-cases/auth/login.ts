import { UserRepository } from '../../repositories/user.repository.interface';
import { comparePassword } from '../../utils/helper';
import { AppError } from '../../utils/error';

interface LoginRequest {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: LoginRequest) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}