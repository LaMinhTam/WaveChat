import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {getMessage} from '../apis/conversation';
import ChatTextInput from '../components/ChatTextInput';
import Message from '../components/Message';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';

const ChatScreen = ({navigation}) => {
  const {userInfo, accessTokens} = useUserData();
  const {currentConversation, messages, setMessages} = useSocket();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            setMessages([]);
          }}>
          <FeatherIcon
            name="arrow-left"
            size={24}
            color="#fff"
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Text style={{fontSize: 16, fontWeight: '700', color: '#fff'}}>
          {currentConversation.name}
        </Text>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row', marginRight: 10, gap: 20}}>
          <TouchableOpacity onPress={() => handleCall()}>
            <FeatherIcon name="phone" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleVideoCall()}>
            <FeatherIcon name="video" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenu()}>
            <FeatherIcon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
    loadMessages();
  }, []);

  const handleCall = () => {
    navigation.navigate('CallPhoneScreen');
  };

  function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  }

  const loadMessages = async () => {
    let newMessages = await getMessage(
      currentConversation._id,
      accessTokens.accessToken,
    );

    setMessages([...newMessages, ...messages]);
  };

  const loadMoreMessage = async () => {
    let newMessages = await getMessage(
      currentConversation._id,
      accessTokens.accessToken,
      messages.length,
    );

    setMessages([...messages, ...newMessages]);
  };

  const renderMessageItem = ({item}) => {
    if (currentConversation._id == item.conversation_id)
      return <Message item={item} userInfo={userInfo} />;
  };

  // TODO: to call phone

  const otherUser = currentConversation.members.find(
    member => member._id !== userInfo._id,
  );

  return (
    <View style={{flex: 1, backgroundColor: '#e4f2eb'}}>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessageItem}
        inverted
        style={{padding: 5}}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            console.log('top');
            loadMoreMessage();
          }
        }}
      />
      <ChatTextInput
        accessTokens={accessTokens}
        memberId={otherUser}
        userInfo={userInfo}
      />
    </View>
  );
};

export default ChatScreen;
