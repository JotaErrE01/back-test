import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/token-virtual/entities/token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  async getLogs() {
    const result = await this.tokenRepository.find({ relations: ['user'], order: { createdAt: 'DESC' } });

    return result.map(token => ({ ...token, ...token.user }));
  }
}
