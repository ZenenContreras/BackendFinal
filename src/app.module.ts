import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UsersModule } from './infrastructure/controllers/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }