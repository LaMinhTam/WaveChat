import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PRIMARY_TEXT_COLOR, MAIN_COLOR, SECOND_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {createConversation} from '../apis/conversation';
import ImagePicker from 'react-native-image-crop-picker';
import {useAuth} from '../contexts/auth-context';
import {sendImageMessage} from '../utils/S3Bucket';
// import {uploadImageToS3} from '../utils/S3Bucket';

const ChatTextInput = ({accessTokens}) => {
  const [newMessage, setNewMessage] = useState('');
  const {userInfo} = useAuth();
  const {
    socket,
    currentConversation,
    setCurrentConversation,
    setConversations,
  } = useSocket();

  const createOrUpdateConversation = async (memberId, accessToken) => {
    if (!currentConversation.conversation_id) {
      const newConversation = await createConversation(memberId, accessToken);

      const updateConversation = {
        ...currentConversation,
        conversation_id: newConversation.data.conversation_id,
      };

      setCurrentConversation(updateConversation);
      setConversations(prevConversations => [
        ...prevConversations,
        updateConversation,
      ]);

      return newConversation.data.conversation_id;
    }
    return currentConversation.conversation_id;
  };

  const handleSendMessage = async () => {
    let conversationID = await createOrUpdateConversation(
      currentConversation.members[1]._id,
      accessTokens.accessToken,
    );

    try {
      handleMessage(conversationID, newMessage, 1);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleSelectImage = () => {
    ImagePicker.openPicker({multiple: true, cropping: false})
      .then(async images => {
        images.map(async image => {
          let conversationID = await createOrUpdateConversation(
            currentConversation.members[1]._id,
            accessTokens.accessToken,
          );

          await sendImageMessage(image, conversationID);

          const content = image.path.split('/').pop();
          handleMessage(conversationID, content, 2);
        });
      })
      .catch(error => {
        console.error('error', error);
      });
  };
  const handleMessage = (conversationID, messageContent, type) => {
    const message = {
      conversation_id: conversationID,
      message: messageContent,
      type: type,
      created_at: new Date().getTime(),
    };
    console.log('message', message);
    socket.emit('message-text', message);
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
        style={{flex: 1, marginRight: 10, color: PRIMARY_TEXT_COLOR}}
        placeholder="Tin nhắn..."
        placeholderTextColor={'#DFDFDF'}
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
        <TouchableOpacity onPress={handleSelectImage}>
          <Ionicons name="image-outline" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatTextInput;
