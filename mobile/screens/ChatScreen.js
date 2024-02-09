import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useAuth} from '../contexts/auth-context';
import {useSocket} from '../contexts/SocketProvider';
import {getConversationDetail} from '../apis/conversation';
import Message from '../components/Message';
import ChatTextInput from '../components/ChatTextInput';

const PrivateChatScreen = ({navigation}) => {
  const {userInfo, accessTokens} = useAuth();
  const {currentConversation, messages, setMessages} = useSocket();
  const [users, setUsers] = useState([]);

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

    const getUsers = async () => {
      const fetchedUsers = currentConversation.members.map(member => ({
        _id: member._id,
        avatar: member.avatar,
        full_name: member.full_name,
      }));
      setUsers(fetchedUsers);
    };

    getUsers();
  }, [userInfo._id]);

  const loadMessages = async () => {
    try {
      const conversationDetail = await getConversationDetail(
        currentConversation.conversation_id,
      );
      setMessages(conversationDetail.messages);
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    }
  };

  const renderMessageItem = ({item}) => {
    return <Message item={item} userInfo={userInfo} users={users} />;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#e4f2eb'}}>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessageItem}
        inverted
      />
      <ChatTextInput accessTokens={accessTokens} />
    </View>
  );
};

export default PrivateChatScreen;
