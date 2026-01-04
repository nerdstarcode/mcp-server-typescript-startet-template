import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';

@Module({
  imports: [],
  controllers: [McpController],
  providers: [],
})
export class AppModule {}
