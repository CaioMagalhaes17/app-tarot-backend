import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseFrontendUrlFactory } from './infra/base-frontend-url.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const baseUrlFactory = app.get(BaseFrontendUrlFactory);
  const frontendUrl = baseUrlFactory.get(); // Aqui você pega a URL baseada no ENV

  app.enableCors({
    origin: frontendUrl, // Origem permitida (URL do seu frontend)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Permitir cookies ou headers com credenciais
  });

  await app.listen(3000);
}
bootstrap();
