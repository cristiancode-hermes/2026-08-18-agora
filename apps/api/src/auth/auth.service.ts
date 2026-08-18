import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', {
        username: registerDto.username,
        email: registerDto.email,
      })
      .getOne();

    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = this.usersRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || 'visitor',
    } as any);

    const saved = await this.usersRepository.save(user);
    const token = this.generateToken(saved as any);

    const { password, ...result } = saved as any;
    return { user: result, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :login OR user.email = :login', {
        login: loginDto.login,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    const { password, ...result } = user as any;
    return { user: result, token };
  }

  async me(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user as any;
    return { user: result };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, role: user.role, username: user.username };
    return this.jwtService.sign(payload);
  }
}
