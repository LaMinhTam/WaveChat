import HOST_IP from './host';
const waveChatEndpoint = `http://${HOST_IP}:3000`;

export const waveChatApi = {
  signUp: () => `${waveChatEndpoint}/auth/sign-up`,
  login: () => `${waveChatEndpoint}/auth/sign-in`,
  getProfile: id => `${waveChatEndpoint}/user/profile?_id=${id}`,
  updateProfile: () => `${waveChatEndpoint}/user/update`,
  getFriends: type => `${waveChatEndpoint}/friend?type=${type}`,
  getConversationDetail: id =>
    `${waveChatEndpoint}/conversation/detail?conversation_id=${id}`,
};
