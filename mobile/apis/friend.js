import axios from 'axios';
import {waveChatApi} from './constants';
import {createConversation} from './conversation';

export async function getFriends(type, accessToken) {
  const res = await axios.get(waveChatApi.getFriends(type), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
}

export async function sendFriendRequest(id, accessToken) {
  const res = await axios.post(
    waveChatApi.sendFriendRequest(id),
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

export async function acceptFriendRequest(id, accessToken) {
  const res = await axios.post(
    waveChatApi.acceptFriendRequest(id),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (res.data.status === 200) {
    await createConversation(id, accessToken);
  }

  return res.data;
}

export async function revokeFriendRequest(id, accessToken) {
  const res = await axios.post(
    waveChatApi.revokeFriendRequest(id),
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

export async function removeFriend(id, accessToken) {
  const res = await axios.post(
    waveChatApi.removeFriend(id),
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
