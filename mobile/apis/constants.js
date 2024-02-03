const waveChatEndpoint = 'http://192.168.1.10:3000';

export const waveChatApi = {
  signUp: () => `${waveChatEndpoint}/auth/sign-up`,
  login: () => `${waveChatEndpoint}/auth/sign-in`,
  getProfile: id => `${waveChatEndpoint}/user/profile?_id=${id}`,
  updateProfile: () => `${waveChatEndpoint}/user/update`,
  getFriends: () => `${waveChatEndpoint}/friend?type=4`,
};
