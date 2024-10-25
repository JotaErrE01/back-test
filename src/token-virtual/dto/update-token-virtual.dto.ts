import { PartialType } from '@nestjs/mapped-types';
import { LoginUserDto } from './login-user.dto';

export class UpdateTokenVirtualDto extends PartialType(LoginUserDto) { }
