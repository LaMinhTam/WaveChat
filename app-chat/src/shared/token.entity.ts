import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base-model.entity';

@Schema({
  collection: 'tokens',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    // getters: true,
    // virtuals: true,
  },
})
export class UserToken extends BaseModel {
  @Prop({
    type: 'string',
    nullable: true,
    default: '',
  })
  token: string;

  @Prop({
    type: 'string',
    default: '',
    ref: 'User',
  })
  user_id: string;

  @Prop({
    type: Number,
    // expires: 60,
  })
  expired_at: number;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
