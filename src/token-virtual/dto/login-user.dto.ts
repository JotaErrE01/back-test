import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';


export class LoginUserDto {

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  userId: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  token: number;

}
