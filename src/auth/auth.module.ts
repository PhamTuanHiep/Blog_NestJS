import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true, //cho phép JWT được sử dụng ở global - ko phải import ở từng module
      secret: '123456', //hardcode một chuỗi bí mật  (secret key)  để  ký (sign) các token. Trong thực tế bạn nên sử dụng các biến môi trường (environment variables)
      signOptions: { expiresIn: '1h' }, //thiết lập các tùy chọn cho quá trình tạo JWT
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
