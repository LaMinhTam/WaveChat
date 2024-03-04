import React, {useEffect} from 'react';
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

  const loadMessages = async () => {
    const messages = await getMessage(
      currentConversation._id,
      accessTokens.accessToken,
    );
    setMessages(messages);
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
      />
      <ChatTextInput accessTokens={accessTokens} memberId={otherUser} />
    </View>
  );
};

export default ChatScreen;
