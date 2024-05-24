import {View, Text, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createConversation, getConversationDetail} from '../apis/conversation';
import {useUserData} from '../contexts/auth-context';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MAIN_COLOR, PRIMARY_TEXT_COLOR, SECOND_COLOR} from '../styles/styles';
import {TruncatedText} from '../utils/TruncatedText';
import {useSocket} from '../contexts/SocketProvider';
import AvatarUser from '../components/AvatarUser';
import {USER_INFO} from '../apis/constants';
import {formatTimeLastActivity} from '../utils/format-time-message.util';

const PrivateChatScreen = ({navigation}) => {
  const {userInfo, accessTokens} = useUserData();
  const {
    socket,
    currentConversation,
    setCurrentConversation,
    conversations,
    setConversations,
    messages,
    setMessages,
  } = useSocket();
  const [newMessage, setNewMessage] = useState('');

  const attachInfoForMessage = () => {
    const updatedMessages = messages.map(message => {
      const member = currentConversation.members.find(
        member => member._id === message.user_id,
      );
      if (member) {
        message.avatar = member.avatar;
        message.full_name = member.full_name;
      }
      return message;
    });
    setMessages(updatedMessages);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
          }}>
          {currentConversation.name}
        </Text>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            marginRight: 10,
            gap: 20,
          }}>
          <TouchableOpacity
            onPress={() =>
              //handleCall()
              conversations.map(conversation =>
                console.log('conversation suppose', conversation),
              )
            }>
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

    attachInfoForMessage();
    // loadMessages();
  }, [accessTokens, userInfo._id, newMessage]);

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
    const isCurrentUser = item.user_id === userInfo._id;

    // const messageTime = new Date(item.created_at).toLocaleTimeString([], {
    //   hour: '2-digit',
    //   minute: '2-digit',
    // });
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
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <TruncatedText text={item.message} />
          <Text style={{color: '#777', fontSize: 12, marginTop: 5}}>
            {formatTimeLastActivity(item.created_at)}
          </Text>
        </View>
        {isCurrentUser && (
          <AvatarUser
            avatarUrl={item.user.avatar}
            style={USER_INFO.AVATAR_USER_STYLES_DEFAULT}
            type={CONVERSATION_TYPE.PERSONAL}
          />
        )}
      </View>
    );
  };

  const handleSendMessage = async () => {
    let conversationID = currentConversation.conversation_id;
    try {
      if (!currentConversation.conversation_id) {
        const newConversation = await createConversation(
          currentConversation.members[1]._id,
          accessTokens,
        );
        conversationID = newConversation.data.conversation_id;
        let updateConversation = {
          ...currentConversation,
          conversation_id: conversationID,
          type: 2,
          is_pinned: 0,
          is_notify: 0,
          is_hidden: 0,
          is_confirm_new_member: 0,
          no_of_member: 2,
          no_of_not_seen: 0,
          no_of_waiting_confirm: 0,
          my_permission: 0,
          created_at: new Date().getTime(),
          updated_at: new Date().getTime(),
          last_activity: new Date().getTime(),
          last_connect: '',
        };

        setCurrentConversation(updateConversation);

        setConversations(prevConversations => [
          ...prevConversations,
          updateConversation,
        ]);
      }

      const message = {
        conversation_id: conversationID,
        message: newMessage,
        type: 1,
        created_at: new Date().getTime(),
      };
      socket.emit('message-text', message);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#e4f2eb'}}>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={renderMessageItem}
        inverted
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: SECOND_COLOR,
        }}>
        <TextInput
          style={{
            flex: 1,
            marginRight: 10,
          }}
          placeholder="Tin nhắn..."
          placeholderTextColor={PRIMARY_TEXT_COLOR}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <>
          {newMessage.trim() ? (
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}>
              <Ionicons name="send" size={24} color={MAIN_COLOR} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="image-outline" size={24} color={MAIN_COLOR} />
            </TouchableOpacity>
          )}
        </>
      </View>
    </View>
  );
};

export default PrivateChatScreen;
