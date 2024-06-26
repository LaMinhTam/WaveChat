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

export async function removeAccount(accessToken) {
  const res = await axios.post(
    waveChatApi.removeAccount(),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
}

export async function resetPassword(phoneNumber, password) {
  const res = await axios.post(waveChatApi.resetPassword(), {
    phone: phoneNumber,
    password: password,
  });
  return res.data;
}

export async function blockUser(id, accessToken) {
  const res = await axios.post(
    waveChatApi.blockUser(id),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
}

export async function removeBlock(id, accessToken) {
  const res = await axios.post(
    waveChatApi.removeBlock(id),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
}

export async function getBlockList(accessToken) {
  const res = await axios.get(waveChatApi.getBlockList(), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}
