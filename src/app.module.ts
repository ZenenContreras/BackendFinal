import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UsersModule } from './infrastructure/controllers/users/users.module';
import { CoursesModule } from './infrastructure/controllers/courses/courses.module';
import { ChallengesModule } from './infrastructure/controllers/challenges/challenges.module';
import { SubmissionsModule } from './infrastructure/controllers/submissions/submissions.module';
import { WorkerModule } from './infrastructure/worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    ChallengesModule,
    SubmissionsModule,
    WorkerModule,
  ],
})
export class AppModule {}
