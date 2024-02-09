import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PRIMARY_TEXT_COLOR, MAIN_COLOR, SECOND_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {createConversation} from '../apis/conversation';

const ChatTextInput = ({accessTokens}) => {
  const [newMessage, setNewMessage] = useState('');
  const {
    socket,
    currentConversation,
    setCurrentConversation,
    setConversations,
  } = useSocket();

  const handleSendMessage = async () => {
    let conversationID = currentConversation.conversation_id;
    try {
      if (!currentConversation.conversation_id) {
        const newConversation = await createConversation(
          currentConversation.members[1]._id,
          accessTokens.accessToken,
        );
        conversationID = newConversation.data.conversation_id;
        const updateConversation = {
          ...currentConversation,
          conversation_id: conversationID,
          // type: 2,
          // is_pinned: 0,
          // is_notify: 0,
          // is_hidden: 0,
          // is_confirm_new_member: 0,
          // no_of_member: 2,
          // no_of_not_seen: 0,
          // no_of_waiting_confirm: 0,
          // my_permission: 0,
          // created_at: new Date().getTime(),
          // updated_at: new Date().getTime(),
          // last_activity: new Date().getTime(),
          // last_connect: '',
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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: SECOND_COLOR,
      }}>
      <TextInput
        style={{flex: 1, marginRight: 10}}
        placeholder="Tin nhắn..."
        placeholderTextColor={PRIMARY_TEXT_COLOR}
        value={newMessage}
        onChangeText={setNewMessage}
      />
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
    </View>
  );
};

export default ChatTextInput;
