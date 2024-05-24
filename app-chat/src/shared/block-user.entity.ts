// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
// import { BaseModel } from './base-model.entity';

// @Schema({
//   collection: 'blocks',
//   timestamps: {
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
//   toJSON: {
//     // getters: true,
//     // virtuals: true,
//   },
// })
// export class BlockUser extends BaseModel {
//   @Prop({
//     type: Types.ObjectId,
//     ref: 'User',
//   })
//   user_id: Types.ObjectId;

//   @Prop({
//     type: Types.ObjectId,
//     ref: 'User',
//   })
//   user_block_id: Types.ObjectId;
// }
// const BlockUserSchema = SchemaFactory.createForClass(BlockUser);

// // BlockUserSchema.pre('save', function (next) {
// //   this.updated_at = +moment();
// //   next();
// // });

// export { BlockUserSchema };
