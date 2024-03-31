import axios from 'axios';
import {waveChatApi} from './constants';

export async function getConversations(token) {
  const res = await axios.get(waveChatApi.getConversations(), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getConversationDetail(id, token) {
  const res = await axios.get(waveChatApi.getConversationDetail(id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function createConversation(member_id, token) {
  const res = await axios.post(
    waveChatApi.createConversation(),
    {
      member_id: member_id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}

export async function createGroupConversation(groupName, member_ids, token) {
  const res = await axios.post(
    waveChatApi.createGroupConversation(),
    {
      member_ids: member_ids,
      name: groupName,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}

export async function getMessage(conversation_id, token) {
  const res = await axios.get(waveChatApi.getMessages(conversation_id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getMembers(conversation_id, token) {
  const res = await axios.get(waveChatApi.getMembers(conversation_id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function addMember(conversation_id, member_ids, token) {
  const res = await axios.post(
    waveChatApi.addMember(conversation_id),
    {
      members: member_ids,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}

export async function removeMember(conversation_id, member_id, token) {
  const res = await axios.post(
    waveChatApi.removeMember(conversation_id),
    {
      user_id: member_id,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}

export async function leaveGroup(conversation_id, token) {
  const res = await axios.post(
    waveChatApi.leaveGroup(conversation_id),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}

export async function deleteConversation(conversation_id, token) {
  const res = await axios.post(
    waveChatApi.deleteConversation(conversation_id),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
}
