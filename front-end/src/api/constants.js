export const CONVERSATION_MEMBER_PERMISSION = {
    MEMBER: 0,
    DEPUTY: 1,
    OWNER: 2,
};

export const CONVERSATION_TYPE = {
    SYSTEM: 0,
    GROUP: 1,
    PERSONAL: 2,
};

export const MESSAGE_SYSTEM_TYPE = {
    UPDATE_NAME: 7,
    UPDATE_AVATAR: 8,
    UPDATE_BACKGROUND: 9,
    REMOVE_USER: 10,
    ADD_NEW_USER: 11,
    CHANGE_PERMISSION_USER: 12,
    USER_OUT_GROUP: 13,
    REVOKE_MESSAGE: 14,
    NEW_GROUP: 15,
    YOU_IS_CHANGE_PERMISSION: 17,
    UPDATE_IS_CONFIRM_NEW_MEMBER: 18,
    UPDATE_IS_OFF_CONFIRM_NEW_MEMBER: 19,
    UPDATE_IS_JOIN_WITH_LINK: 20,
    UPDATE_IS_SEND_MESSAGE: 21,
    ADD_DEPUTY: 22,
    REMOVE_DEPUTY: 23,
    WAITING_CONFIRM: 24,
    JOIN_WITH_LINK: 25,
};

export const groupAvatarDefault =
    "https://wavechat.s3.ap-southeast-1.amazonaws.com/default-group-icon-dark.webp";
