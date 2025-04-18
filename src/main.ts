import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Cambiar a la URL de tu frontend en produccion [ejemplo. 'https://miapp.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept', 
      'Origin', 
      'Access-Control-Allow-Origin', 
      'X-HTTP-Method-Override'
    ] 
  });

  app.use(helmet(
    {
      frameguard: {action: 'deny'},
      hidePoweredBy: true,
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'same-origin'}
    }
  ))


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidUnknownValues: true,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },  'JWT')
    .setTitle('NestJS Auth API')
    .setDescription(`
      API RESTful básica para autenticación con JWT, gestión de roles, envíos de correos y notificaciones de inicio de sesión por WhatsApp.
    `)
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'NestJS API',
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
  await app.listen(AppModule.port);
}

bootstrap();
