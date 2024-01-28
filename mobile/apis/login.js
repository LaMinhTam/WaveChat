import axios from 'axios';
import {waveChatApi} from './constants';

export async function Login(phone, password) {
  const res = await axios.post(waveChatApi.login(), {
    phone: phone,
    password: password,
  });
  return res.data;
}
