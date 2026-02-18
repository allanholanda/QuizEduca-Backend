import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
}

// Middleware para verificar se é professor
export async function requireTeacher(request: FastifyRequest, reply: FastifyReply) {
  if (request.user.role !== 'teacher') {
    reply.status(403).send({ message: 'Forbidden: Teachers only' });
  }
}