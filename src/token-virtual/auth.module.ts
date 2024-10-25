import { Module } from '@nestjs/common';
import { TokenVirtualService } from './auth.service';
import { TokenVirtualController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [TokenVirtualController],
  providers: [TokenVirtualService],
  imports: [
    TypeOrmModule.forFeature([Token, User]),
  ]
})
export class TokenVirtualModule { }
