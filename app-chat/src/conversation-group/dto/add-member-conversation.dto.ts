import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class AddMemberConversationDto {
  @IsArray({ message: 'Truyền mảng string các user_id cần thêm vào nhóm' })
  @ArrayMinSize(1, { message: 'Ít nhất phải có 1 user_id cần thêm' })
  members: string[];
}

export class RemoveMemberConversationDto {
  @IsNotEmpty()
  user_id: string;
}

export class ConfirmMemberConversationDto {
  @IsArray({ message: 'Truyền mảng string các user_id cần thêm vào nhóm' })
  @ArrayMinSize(1, { message: 'Ít nhất phải có 1 user_id cần thêm' })
  members: string[];

  @IsNotEmpty()
  // type: 1: chấp nhận, 0: từ chối
  type: number;

  // @IsNotEmpty()
  // // confirm_all: 1: chấp nhận tất cả, 0: từ chối tất cả
  // is_confirm_all: number;
}
