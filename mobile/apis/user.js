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

export async function findUserByPhoneNumber(phoneNumber, accessToken) {
  const res = await axios.get(waveChatApi.findUserByPhoneNumber(phoneNumber), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}

export async function changePassword(oldPassword, newPassword, accessToken) {
  const res = await axios.post(
    waveChatApi.changePassword(),
    {
      old_password: oldPassword,
      new_password: newPassword,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
}
