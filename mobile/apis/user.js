import axios from 'axios';
import {waveChatApi} from './constants';

export async function getProfile(id, accessToken) {
  const res = await axios.get(waveChatApi.getProfile(id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}

export async function updateProfile(userInfo, accessToken) {
  const res = await axios.post(waveChatApi.updateProfile(), userInfo, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}

export async function getFriends(accessToken) {
  const res = await axios.get(waveChatApi.getFriends(), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}
