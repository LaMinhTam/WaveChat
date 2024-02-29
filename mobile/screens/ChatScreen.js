import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useUserData} from '../contexts/auth-context';
import {useSocket} from '../contexts/SocketProvider';
import {getMessage} from '../apis/conversation';
import Message from '../components/Message';
import ChatTextInput from '../components/ChatTextInput';

const PrivateChatScreen = ({navigation}) => {
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

  const loadMessages = async () => {
    const messages = await getMessage(
      currentConversation._id,
      accessTokens.accessToken,
    );

    setMessages(messages);
  };

  const renderMessageItem = ({item}) => {
    return <Message item={item} userInfo={userInfo} />;
  };

  const otherUser = currentConversation.members.find(
    member => member._id !== userInfo._id,
  );

  return (
    <View style={{flex: 1, backgroundColor: '#e4f2eb'}}>
      {messages.length > 0 && (
        <FlatList
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderMessageItem}
          inverted
          style={{padding: 5}}
        />
      )}

      <ChatTextInput accessTokens={accessTokens} memberId={otherUser} />
    </View>
  );
};

export default PrivateChatScreen;
