import HOST_IP from './host';
const waveChatEndpoint = `http://${HOST_IP}:3000`;

export const waveChatApi = {
  signUp: () => `${waveChatEndpoint}/auth/sign-up`,
  login: () => `${waveChatEndpoint}/auth/sign-in`,
  getProfile: id => `${waveChatEndpoint}/user/profile?_id=${id}`,
  updateProfile: () => `${waveChatEndpoint}/user/update`,
  getFriends: type => `${waveChatEndpoint}/friend?type=${type}`,
  getConversations: () => `${waveChatEndpoint}/conversation`,
  getConversationDetail: id =>
    `${waveChatEndpoint}/conversation/detail?conversation_id=${id}`,
  getMessages: id => `${waveChatEndpoint}/message/${id}?limit=100000`,
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
