const waveChatEndpoint = 'http://localhost:3000';

export const waveChatApi = {
  getProfile: id => `${waveChatEndpoint}/user/profile?_id=${id}`,
  login: () => `${waveChatEndpoint}/auth/sign-in`,
};
