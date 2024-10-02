import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/users.entity';
import * as brcypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(registerUserDto.password);

    return await this.userRepository.save({
      ...registerUserDto,
      refresh_token: 'refresh_token_string',
      password: hashPassword,
    });
  }
  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await brcypt.genSalt(saltRound);
    const hash = await brcypt.hash(password, salt);
    return hash;
  }
}
