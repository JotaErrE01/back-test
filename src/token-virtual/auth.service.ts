import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/env.config';

@Injectable()
export class TokenVirtualService {

  constructor(
    private configService: ConfigService<EnvVars>,

    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async genToken(userId: number) {
    const user = await this.findUserById(userId);

    if (user.token && user.token.status === 'available') {
      const isValid = await this.isValidToken(user.token.expirationDate);
      if (isValid) return user.token;

      this.tokenRepository.update({ id: user.token.id }, { status: 'expired' });
    }

    const token = this.generateOtp();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + this.configService.get('OTP_MINUTES_EXPIRATION_TIME'));

    this.tokenRepository.create();
    const tokenVirtual = await this.tokenRepository.save({
      token,
      expirationDate,
      createdAt: new Date(),
      user: { id: user.id },
    });

    delete tokenVirtual.user;

    return tokenVirtual;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.findUserById(loginUserDto.userId);
    const token = user.token;

    if (!token || token?.token !== loginUserDto.token) throw new NotFoundException('Token no encontrado');
    if (token.status === 'used') throw new BadRequestException('Token ya utilizado');
    if (token.status === 'expired') throw new BadRequestException('Token expirado');

    const isValid = await this.isValidToken(token.expirationDate);
    await this.tokenRepository.update({ id: token.id }, { status: 'expired' });
    if (!isValid) throw new BadRequestException('Token expirado');

    // update to used
    await this.tokenRepository.update({ id: token.id }, { status: 'used' });

    return user;
  }

  private generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async isValidToken(expirationDate: Date) {
    return expirationDate >= new Date();
  }

  private async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['token'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { token, ...rest } = user;

    return {
      ...rest,
      token: token.find(t => t.status === 'available'),
    };
  }
}
