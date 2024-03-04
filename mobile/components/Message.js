import React from 'react';
import {View, Text, Image} from 'react-native';
import {TruncatedText} from '../utils/TruncatedText';
import MessageImage from './MessageImage';
import MessageFile from './MessageFile';

const Message = ({item, userInfo}) => {
  const formatTime = time => {
    return (
      new Date(time).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }) +
      ' ' +
      new Date(time).toLocaleDateString('vi-VN')
    );
  };

  // console.log('item', item);
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
        <Image
          source={{uri: item.user.avatar}}
          style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}}
        />
      )}
      <View
        style={{
          maxWidth: '60%',
          backgroundColor: isCurrentUser ? '#d6ffeb' : '#F0F0F0',
          padding: 10,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}>
        {renderContent()}
        <Text style={{color: '#777', fontSize: 12, marginTop: 5}}>
          {formatTime(item.created_at)}
        </Text>
      </View>
      {isCurrentUser && (
        <Image
          source={{uri: item.user.avatar}}
          style={{width: 40, height: 40, borderRadius: 20, marginLeft: 10}}
        />
      )}
    </View>
  );
};

export default Message;
