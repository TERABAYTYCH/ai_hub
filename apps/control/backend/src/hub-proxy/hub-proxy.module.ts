import { Module } from '@nestjs/common';
import { HubProxyController } from './hub-proxy.controller';

@Module({
  controllers: [HubProxyController],
})
export class HubProxyModule {}
