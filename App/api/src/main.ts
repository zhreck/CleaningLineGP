// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { trace } from '@opentelemetry/api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for the e-commerce platform with pagination support')
    .setVersion('1.0')
    .addTag('Products', 'Product management endpoints with pagination')
    .addTag('Categories', 'Category management endpoints')
    .addTag('Cart', 'Shopping cart endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .addServer('http://localhost:3002', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'E-commerce API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma los tipos de datos (e.g., string a number)
    }),
  );

  // Habilitar CORS para el frontend en Next (localhost:3000)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);

  // Test manual tracing
  const tracer = trace.getTracer('shopping-ecommerce-api');
  const span = tracer.startSpan('application-startup');
  span.setAttributes({
    'app.name': 'shopping-ecommerce-api',
    'app.version': '1.0.0',
    'startup.port': port.toString()
  });
  span.addEvent('Application started successfully');
  span.end();
  console.log('🔍 Manual trace sent for application startup');
}
bootstrap();
