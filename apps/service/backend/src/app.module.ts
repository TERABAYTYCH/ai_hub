import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { HubProxyModule } from './hub-proxy/hub-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HubProxyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
