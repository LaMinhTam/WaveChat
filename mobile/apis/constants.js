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
  getMessages: id => `${waveChatEndpoint}/message/${id}`,
  createConversation: () => `${waveChatEndpoint}/conversation/create`,
  sendFriendRequest: id => `${waveChatEndpoint}/friend/send?_id=${id}`,
  acceptFriendRequest: id => `${waveChatEndpoint}/friend/accept?_id=${id}`,
  revokeFriendRequest: id =>
    `${waveChatEndpoint}/friend/remove-request?_id=${id}`,
  removeFriend: id => `${waveChatEndpoint}/friend/remove-friend?_id=${id}`,
};
