import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterUseCase } from '../../use-cases/auth/register';
import { LoginUseCase } from '../../use-cases/auth/login';
import { UserRepository } from '../../repositories/user.repository.interface';
import { registerSchema, loginSchema } from '../schemas/auth';

const userRepository = new UserRepository();

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const data = registerSchema.parse(request.body);
  const registerUseCase = new RegisterUseCase(userRepository);
  const user = await registerUseCase.execute(data);

  const token = await reply.jwtSign({ id: user.id, role: user.role });
  return reply.status(201).send({ user, token });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const data = loginSchema.parse(request.body);
  const loginUseCase = new LoginUseCase(userRepository);
  const user = await loginUseCase.execute(data);

  const token = await reply.jwtSign({ id: user.id, role: user.role });
  return reply.send({ user, token });
}