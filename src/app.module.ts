import { Module } from '@nestjs/common';
import { TokenVirtualModule } from './token-virtual/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { enviromentShcema, envs, EnvVars } from './config/env.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [() => envs],
      isGlobal: true,
      validate: (config) => {
        const parsed = enviromentShcema.safeParse(config);
        if (!parsed.success) {
          throw new Error(`Validation error: ${parsed.error.message}`);
        }
        return parsed.data;
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVars>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true
      }),
      imports: [ConfigModule],
    }),
    TokenVirtualModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
