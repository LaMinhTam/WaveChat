import axios from 'axios';
import {waveChatApi} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getConversations() {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await axios.get(waveChatApi.getConversations(), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getConversationDetail(id) {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await axios.get(waveChatApi.getConversationDetail(id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getListMember(id) {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await axios.get(waveChatApi.getListMember(id), {
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

export async function updatePermission(
  conversation_id,
  member_id,
  permission,
  token,
) {
  const res = await axios.post(
    waveChatApi.updatePermission(conversation_id),
    {
      user_id: member_id,
      permission: permission,
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

export async function disbandConversation(conversation_id, token) {
  const res = await axios.post(
    waveChatApi.disbandConversation(conversation_id),
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

export async function deleteMessage(message_id) {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await axios.post(
    waveChatApi.deleteMessage(message_id),
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

export async function forwardMessage(message_id, conversation_ids, token) {
  console.log('Forward message: ', token);
  const res = await axios.post(
    waveChatApi.forwardMessage(),
    {
      message_id: message_id,
      conversation_ids: conversation_ids,
      content: '',
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

export async function toggleNotification(conversation_id, token) {
  const res = await axios.post(
    waveChatApi.toggleNotification(conversation_id),
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

export async function reactToMessage(message_id) {
  const token = await AsyncStorage.getItem('accessToken');

  const res = await axios.post(
    waveChatApi.reactToMessage(),
    {
      message_id: message_id,
      type: 1,
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

export async function acceptJoinByLink(groupID, token) {
  const res = await axios.post(
    waveChatApi.acceptJoinByLink(groupID),
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

export async function joinByScanLink(link) {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await axios.post(
    waveChatApi.joinByScanLink(link),
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

export async function updateName(conversation_id, name, token) {
  const res = await axios.post(
    waveChatApi.updateName(conversation_id),
    {
      name: name,
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

export async function getWaitingMember(conversation_id, token) {
  const res = await axios.get(waveChatApi.getWaitingMember(conversation_id), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function MemberApprovalToggle(conversation_id, token) {
  const res = await axios.post(
    waveChatApi.MemberApprovalToggle(conversation_id),
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

export async function memberWaitingBehavior(
  conversation_id,
  member,
  type,
  token,
) {
  console.log(conversation_id, member, type, token);
  const res = await axios.post(
    waveChatApi.memberWaitingBehavior(conversation_id),
    {
      members: member,
      type: type,
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
