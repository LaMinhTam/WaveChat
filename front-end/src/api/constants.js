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

export const WAVE_CHAT_API = {
    listMessage: (conversationId, limit) =>
        `/message/list/${conversationId}?limit=${limit}`,
    addMember: (conversationId) =>
        `/conversation-group/add-member?conversation_id=${conversationId}`,
    updateProfile: () => "/user/update",
    changePassword: () => "/auth/change-password",
    createGroupChat: () => "/conversation-group/create",
    createConversation: () => "/conversation/create",
    shareMessage: () => "/message/share-message",
    changeGroupName: (conversationId) =>
        `/conversation/update-name?conversation_id=${conversationId}`,
    leaveGroup: (conversationId) =>
        `/conversation-group/leave?conversation_id=${conversationId}`,
    removeFriend: (friendId) => `/friend/remove-friend?_id=${friendId}`,
    blockUser: (userId) => `/user/block-user/${userId}`,
    removeBlockUser: (userId) => `/user/remove-block-user/${userId}`,
    sendFriendRequest: (userId) => `/friend/send?_id=${userId}`,
    recallSentRequest: (userId) => `/friend/remove-request?_id=${userId}`,
    acceptFriendRequest: (userId) => `/friend/accept?_id=${userId}`,
    deleteAccount: () => "/user/remove-account",
    listFriendRequest: () => "/friend?type=2",
    listSentRequest: () => "/friend?type=3",
    listBlockUser: () => "/user/list-block-user",
    conversationDetail: (id) => `/conversation/detail?conversation_id=${id}`,
    groupWaitingList: (conversationId) =>
        `/conversation-group/waiting-member?conversation_id=${conversationId}`,
    groupListMember: (conversationId) =>
        `/conversation-group/member?conversation_id=${conversationId}`,
    deleteMessage: (id) => `/message/delete/${id}`,
    deleteConversation: (id) => `/conversation/delete?conversation_id=${id}`,
    reactionMessage: () => "/message/react",
    updateConfirmNewMember: (id) =>
        `/conversation/is_confirm_member?conversation_id=${id}`,
    updateIsJoinWithLink: (id) =>
        `/conversation-group/join-link?conversation_id=${id}`,
    disbandGroup: (id) => `/conversation-group/disband?conversation_id=${id}`,
    removeMemberFromGroup: (conversationId) =>
        `/conversation-group/remove-member?conversation_id=${conversationId}`,
    approvalMember: (id) =>
        `/conversation-group/confirm-member?conversation_id=${id}`,
    findUserByPhone: (value) => `/user/find-phone?phone=${value}`,
    rejectFriendRequest: (id) => `/friend/remove-friend?_id=${id}`,
    joinGroupWithLink: (link) =>
        `/conversation-group/join-with-link?link_join=${link}`,
    updatePermission: (conversationId) =>
        `/conversation-group/update-permission?conversation_id=${conversationId}`,
    listConversations: () => "/conversation/list",
    listFriend: () => "/friend?type=4",
    userProfile: (id) => `user/profile?_id=${id}`,
};
