import 'reflect-metadata';
import { app } from './app';
import { env } from './env';
import { AppDataSource } from './lib/typeorm/typeorm';

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connected');
    app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`🚀 Server listening at ${address}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database', err);
    process.exit(1);
  });