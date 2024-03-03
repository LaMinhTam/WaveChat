import React from 'react';
import {Image} from 'react-native';
import {CONVERSATION_TYPE, USER_INFO} from '../apis/constants';

const AvatarUser = ({avatarUrl, style, type}) => {
  return (
    <Image
      source={{
        uri: avatarUrl?.length
          ? avatarUrl
          : type === CONVERSATION_TYPE.GROUP
          ? USER_INFO.AVATAR_GROUP_URL_DEFAULT
          : USER_INFO.AVATAR_USER_URL_DEFAULT,
      }}
      style={style}
    />
  );
};

export default AvatarUser;
