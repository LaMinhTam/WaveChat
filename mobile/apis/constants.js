import HOST_IP from './host';
const waveChatEndpoint = `https://locph.phungmup.online`;

export const waveChatApi = {
  signUp: () => `${waveChatEndpoint}/auth/sign-up`,
  login: () => `${waveChatEndpoint}/auth/sign-in`,
  getProfile: id => `${waveChatEndpoint}/user/profile?_id=${id}`,
  updateProfile: () => `${waveChatEndpoint}/user/update`,
  removeAccount: () => `${waveChatEndpoint}/user/remove-account`,
  getFriends: type => `${waveChatEndpoint}/friend?type=${type}`,
  getConversations: () => `${waveChatEndpoint}/conversation/list`,
  getConversationDetail: id =>
    `${waveChatEndpoint}/conversation/detail?conversation_id=${id}`,
  getMessages: id => `${waveChatEndpoint}/message/list/${id}?limit=100000`,
  deleteMessage: id => `${waveChatEndpoint}/message/delete/${id}`,
  getMembers: id =>
    `${waveChatEndpoint}/conversation-group/member?conversation_id=${id}`,
  createConversation: () => `${waveChatEndpoint}/conversation/create`,
  createGroupConversation: () =>
    `${waveChatEndpoint}/conversation-group/create`,
  sendFriendRequest: id => `${waveChatEndpoint}/friend/send?_id=${id}`,
  acceptFriendRequest: id => `${waveChatEndpoint}/friend/accept?_id=${id}`,
  revokeFriendRequest: id =>
    `${waveChatEndpoint}/friend/remove-request?_id=${id}`,
  removeFriend: id => `${waveChatEndpoint}/friend/remove-friend?_id=${id}`,
  findUserByPhoneNumber: phoneNumber =>
    `${waveChatEndpoint}/user/find-phone?phone=${phoneNumber}`,
  changePassword: () => `${waveChatEndpoint}/auth/change-password`,
  addMember: id =>
    `${waveChatEndpoint}/conversation-group/add-member?conversation_id=${id}`,
  removeMember: id =>
    `${waveChatEndpoint}/conversation-group/remove-member?conversation_id=${id}`,
  leaveGroup: id =>
    `${waveChatEndpoint}/conversation-group/leave?conversation_id=${id}`,
  deleteConversation: id =>
    `${waveChatEndpoint}/conversation/delete?conversation_id=${id}`,
  disbandConversation: id =>
    `${waveChatEndpoint}/conversation-group/disband?conversation_id=${id}`,
  updatePermission: conversation_id =>
    `${waveChatEndpoint}/conversation-group/update-permission?conversation_id=${conversation_id}`,
  resetPassword: () => `${waveChatEndpoint}/auth/reset-password`,
  blockUser: id => `${waveChatEndpoint}/user/block-user/${id}`,
  removeBlock: id => `${waveChatEndpoint}/user/remove-block-user/${id}`,
  getBlockList: () => `${waveChatEndpoint}/user/list-block-user`,
  forwardMessage: () => `${waveChatEndpoint}/message/share-message`,
  toggleNotification: id =>
    `${waveChatEndpoint}/conversation/notify?conversation_id=${id}`,
  reactToMessage: () => `${waveChatEndpoint}/message/react`,
  acceptJoinByLink: id =>
    `${waveChatEndpoint}/conversation-group/join-link?conversation_id=${id}`,
  joinByScanLink: link =>
    `${waveChatEndpoint}/conversation-group/join-with-link?link_join=${link}`,
  getListMember: id =>
    `${waveChatEndpoint}/conversation-group/member?conversation_id=${id}`,
  updateName: id =>
    `${waveChatEndpoint}/conversation/update-name?conversation_id=${id}`,
  getWaitingMember: id =>
    `${waveChatEndpoint}/conversation-group/waiting-member?conversation_id=${id}`,
  MemberApprovalToggle: id =>
    `${waveChatEndpoint}/conversation/is_confirm_member?conversation_id=${id}`,
  memberWaitingBehavior: conversation_id =>
    `${waveChatEndpoint}/conversation-group/confirm-member?conversation_id=${conversation_id}`,
};

const AVATAR_USER_URL_DEFAULT =
  'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png';
const AVATAR_GROUP_URL_DEFAULT =
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fuser%2F&psig=AOvVaw2RkYTX72NeIlb_S5RV6PUx&ust=1709368950790000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPCK1drV0oQDFQAAAAAdAAAAABAE';

const AVATAR_USER_STYLES_DEFAULT = {
  width: 40,
  height: 40,
  borderRadius: 20,
  // marginRight: 10,
  // marginLeft: 10,
};

export const CONVERSATION_BACKGROUND_STATUS = {
  DELETED: 0,
  ACTIVE: 1,
};

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

export const CONVERSATION_STATUS = {
  ACTIVE: 1,
  NOT_ACTIVE: 0,
  BLOCK: 2,
};

export const USER_INFO = {
  AVATAR_USER_URL_DEFAULT: AVATAR_USER_URL_DEFAULT,
  AVATAR_USER_STYLES_DEFAULT: AVATAR_USER_STYLES_DEFAULT,
  AVATAR_GROUP_URL_DEFAULT: AVATAR_GROUP_URL_DEFAULT,
};
