import axios from 'axios';
import {waveChatApi} from './constants';

export async function getConversationDetail(id, token) {
  try {
    const res = await axios.get(waveChatApi.getConversationDetail(id), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
  }
}

export async function createConversation(member_id, token) {
  try {
    const res = await axios.post(
      waveChatApi.createConversation(),
      {
        member_id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
  }
}
