import React from 'react';
import {Text, View} from 'react-native';
import {CONVERSATION_TYPE, USER_INFO} from '../apis/constants';
import {TruncatedText} from '../utils/TruncatedText';
import {formatTimeLastActivity} from '../utils/format-time-message.util';
import AvatarUser from './AvatarUser';
import MessageFile from './MessageFile';
import MessageImage from './MessageImage';

const Message = ({item, userInfo}) => {
  const isCurrentUser = item.user._id === userInfo._id;

  const renderContent = () => {
    switch (item.type) {
      case 1:
        return <TruncatedText text={item.message} />;
      case 2:
        return <MessageImage item={item} />;
      case 5:
        return <MessageFile item={item} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        marginVertical: 5,
      }}>
      {!isCurrentUser && (
        <AvatarUser
          avatarUrl={item.user.avatar}
          style={USER_INFO.AVATAR_USER_STYLES_DEFAULT}
          type={CONVERSATION_TYPE.PERSONAL}
        />
      )}

      <View
        style={{
          maxWidth: '60%',
          backgroundColor: isCurrentUser ? '#d6ffeb' : '#F0F0F0',
          padding: 10,
          marginHorizontal: 10,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}>
        {renderContent()}

        <Text style={{color: '#777', fontSize: 12, marginTop: 5}}>
          {formatTimeLastActivity(item.created_at)}
        </Text>
      </View>

      {/* {isCurrentUser && (
        <AvatarUser
          avatarUrl={item.user.avatar}
          style={USER_INFO.AVATAR_USER_STYLES_DEFAULT}
          type={CONVERSATION_TYPE.PERSONAL}
        />
      )} */}
    </View>
  );
};

export default Message;
