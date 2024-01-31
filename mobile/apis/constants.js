const waveChatEndpoint = 'http://192.168.1.10:3000';

export const waveChatApi = {
  getProfile: id => `${waveChatEndpoint}/user/profile?_id=${id}`,
  login: () => `${waveChatEndpoint}/auth/sign-in`,
};
