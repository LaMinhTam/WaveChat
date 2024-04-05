import {getTokenByIdFromFireStore} from './firestoreManage';

const getMembersTokens = async members => {
  const memberTokens = members.map(member => getTokenByIdFromFireStore(member));
  let membersTokensArrays = await Promise.all(memberTokens);
  membersTokensArrays = membersTokensArrays.filter(token => token);
  return membersTokensArrays.flat();
};

const getOtherMembers = (conversation, userInfo) => {
  return conversation.members.filter(member => member !== userInfo._id);
};

export const notifyMessageToOtherMembers = async (
  message,
  conversation,
  userInfo,
) => {
  const otherMembers = getOtherMembers(conversation, userInfo);
  const tokens = await getMembersTokens(otherMembers);
  message = {
    registration_ids: tokens,
    notification: {
      title: conversation.type === 2 ? userInfo.full_name : conversation.name,
      body: `${userInfo.full_name}: ${message.message}`,
      vibrate: 1,
      sound: 1,
      //   image:
      //     'https://yt3.googleusercontent.com/ytc/AL5GRJVhQ4VfaYk7tLNMPDyNkgjTqWKnOXhA-NQZ1FFDUA=s176-c-k-c0x00ffffff-no-rj',
      priority: 'high',
      show_in_foreground: true,
      content_available: true,
    },
    data: {
      //   title: 'data_title',
      //   body: 'data_body',
      //   extra: 'data_extra',
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization:
      'key=' +
      'AAAALdR3-zI:APA91bEpZKyCyZEpWclSRjkcEDVzIiAmJZRktlznM64J0W4mVf-fbKFryp3rLyVnSOZXiWmmFfN4V7t5DQFo3cyMKjQB6wH_AT-zEEJ3in3FFICHrZIpLqBCTajR6RSmZJG-iGlyL3Z2',
  });

  let response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  response = await response.json();
  console.log(response);
};
