import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
// import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  //validating incoming requests bodies automitacally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips(removes) properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payloads to be objects typed according to their dto claases
      disableErrorMessages: false, // inpoduction it must be true
    }),
  );

  // app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();