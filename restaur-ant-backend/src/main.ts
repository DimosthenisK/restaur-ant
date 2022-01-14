import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const configService: ConfigService = app.get(ConfigService);
  //Swagger
  if (configService.get('NODE_ENV') === 'DEV') {
    const config = new DocumentBuilder()
      .setTitle('RestaurAnt API')
      .setDescription('RestaurAnt API')
      .setVersion('1.0')
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const property = errors[0].property;
        const reason = Object.values(errors[0].constraints)[0];
        throw new BadRequestException({
          success: false,
          message: `${property}|${reason}}`,
          errorCode: 'VALIDATION_ERROR',
        });
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
