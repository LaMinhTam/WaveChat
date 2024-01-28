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
