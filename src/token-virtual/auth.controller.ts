import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { TokenVirtualService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('/auth')
export class TokenVirtualController {
  constructor(private readonly tokenVirtualService: TokenVirtualService) { }

  @Get('/generate')
  getToken(@Query('userId', ParseIntPipe) userId: number) {
    return this.tokenVirtualService.genToken(userId);
  }

  @Get('/login')
  authUser(@Query() loginUserDto: LoginUserDto) {
    return this.tokenVirtualService.loginUser(loginUserDto);
  }
}
