import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_HOST, DATABASE_PORT, DATABASE_SSL } from './config/config.keys';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>(DATABASE_HOST),
        port: parseInt(config.get<string>(DATABASE_PORT), 10),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        synchronize: true, //SOLO PARA DESARROLLO
        // synchronize: false,
        logging: true,
        autoLoadEntities: true,
        ssl: config.get<string>(DATABASE_SSL) === 'true',
        extra: {
          ssl:
            config.get<string>(DATABASE_SSL) === 'true'
              ? { rejectUnauthorized: false // SOLO PARA DESARROLLO
                }
              : null,
        },
        dropSchema: false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      }),
    }),
    AuthModule,
    CloudinaryModule,
    MailModule,
    UsersModule,
    WhatsappModule,
    // RolesModule // PENDIENTE
   ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  static port: number | string;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get<number>('PORT') || 3000;
  }
}
