import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: 'ADMIN_SEEDER',
      useFactory: (usersService: UsersService, configService: ConfigService) => {
        const logger = new Logger('AdminSeeder');
        return {
          onApplicationBootstrap: async () => {
            const adminEmail = configService.get<string>('ADMIN_EMAIL');
            const adminPassword = configService.get<string>('ADMIN_PASSWORD');

            if (!adminEmail || !adminPassword) {
              logger.warn('Admin credentials not configured, skipping seed');
              return;
            }

            const existingAdmin = await usersService.findByUsername(adminEmail.split('@')[0]);
            if (existingAdmin) {
              logger.log('Admin user already exists');
              return;
            }

            await usersService.createWithRole(
              adminEmail.split('@')[0],
              adminPassword,
              adminEmail,
              'admin',
            );
            logger.log('Admin user created successfully');
          },
        };
      },
      inject: [UsersService, ConfigService],
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
