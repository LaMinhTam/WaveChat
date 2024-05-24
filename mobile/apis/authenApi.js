import axios from 'axios';
import {waveChatApi} from './constants';

export async function Login(phone, password) {
  try {
    const res = await axios.post(
      waveChatApi.login(),
      {
        phone: phone,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
  }
}

export async function authSignUp(name, phone, password) {
  try {
    const res = await axios.post(
      waveChatApi.signUp(),
      {
        full_name: name,
        nick_name: name,
        phone: phone,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
  }
}
