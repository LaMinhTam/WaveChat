import React, {useState} from 'react';
import {View, Text, Image, Modal, TouchableOpacity} from 'react-native';
import {TruncatedText} from '../utils/TruncatedText';
import MessageImage from './MessageImage';

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

const Message = ({item, userInfo, users}) => {
  const sender = users.find(user => user._id === item.user_id);
  const isCurrentUser = item.user_id === userInfo._id;

  const renderContent = () => {
    switch (item.type) {
      case 1:
        return <TruncatedText text={item.message} />;
      case 2:
        return <MessageImage item={item} />;
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
          source={{uri: sender?.avatar}}
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
          source={{uri: sender?.avatar}}
          style={{width: 40, height: 40, borderRadius: 20, marginLeft: 10}}
        />
      )}
    </View>
  );
};

export default Message;
