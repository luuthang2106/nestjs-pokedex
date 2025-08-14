import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'secret_key',
    signOptions: { expiresIn: '1h' },
  }),],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
