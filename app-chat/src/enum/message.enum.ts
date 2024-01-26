export enum MESSAGE_REACTION_TYPE {
  LIKE = 1,
  LOVE = 2,
  HAHA = 3,
  WOW = 4,
  SAD = 5,
  ANGRY = 6,
}

export enum MESSAGE_STATUS {
  DELETED = 0,
  ACTIVE = 1,
}

export enum MESSAGE_SYSTEM_TYPE {
  UPDATE_NAME = 7,
  UPDATE_AVATAR = 8,
  UPDATE_BACKGROUND = 9,
  REMOVE_USER = 10,
  ADD_NEW_USER = 11,
  CHANGE_PERMISSION_USER = 12,
  USER_OUT_GROUP = 13,
  REVOKE_MESSAGE = 14,
  NEW_GROUP = 15,
  YOU_IS_CHANGE_PERMISSION = 17,
  UPDATE_IS_CONFIRM_NEW_MEMBER = 18,
  UPDATE_IS_OFF_CONFIRM_NEW_MEMBER = 19,
  UPDATE_IS_JOIN_WITH_LINK = 20,
  UPDATE_IS_SEND_MESSAGE = 21,
  ADD_DEPUTY = 22,
  REMOVE_DEPUTY = 23,
  WAITING_CONFIRM = 24,
}

export enum NON_MESSAGE_SYSTEM_TYPE {
  TEXT = 1,
  IMAGE = 2,
  VIDEO = 3,
  AUDIO = 4,
  FILE = 5,
  REPLY = 6,
  STICKER = 16,
}

export const MESSAGE_TYPE = {
  ...NON_MESSAGE_SYSTEM_TYPE,
  ...MESSAGE_SYSTEM_TYPE,
};
export type MESSAGE_TYPE = NON_MESSAGE_SYSTEM_TYPE | MESSAGE_SYSTEM_TYPE;

export interface IMessageUserTarget {
  user_id: number;
  full_name: string;
  avatar: string;
}
