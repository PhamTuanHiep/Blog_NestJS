import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //context là đối tượng ExecutionContext đại diện cho ngữ cảnh của request hiện tại (có thể là HTTP, WebSocket, v.v.).
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //chuyển đổi ngữ cảnh hiện tại sang HTTP context và lấy đối tượng request của yêu cầu HTTP.
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(); //401
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET'),
      });
      //Dữ liệu payload từ token sau khi được giải mã sẽ được gán vào request['user_data']
      request['user_data'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    //request.headers.authorization là nơi chứa Authorization Header trong HTTP request.
    //Header này thường được sử dụng để gửi các thông tin xác thực, ví dụ như Bearer Token hoặc các loại token khác.
    const [type, token] = request.headers.authorization
      ? request.headers.authorization.split(' ')
      : [];
    return type === 'Bearer' ? token : undefined;
  }
}
