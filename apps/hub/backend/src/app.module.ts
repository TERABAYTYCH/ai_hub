import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('HUB_DB_HOST') || 'localhost',
        port: configService.get<number>('HUB_DB_PORT') || 3306,
        username: configService.get('HUB_DB_USER') || 'root',
        password: configService.get('HUB_DB_PASSWORD') || 'root',
        database: configService.get('HUB_DB_NAME') || 'hub_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    DevicesModule,
  ],
})
export class AppModule {}
