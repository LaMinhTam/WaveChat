import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EndCallVideoDto {
  @IsNotEmpty()
  target_user_id: string;

  // @IsNotEmpty()
  // signal_data: any;

  @IsOptional()
  @IsString()
  message: string;
}
