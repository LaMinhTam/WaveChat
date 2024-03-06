import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PRIMARY_TEXT_COLOR, MAIN_COLOR, SECOND_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {createConversation} from '../apis/conversation';
import ImagePicker from 'react-native-image-crop-picker';
import {sendImageMessage, uploadFileToS3} from '../utils/S3Bucket';
import DocumentPicker from 'react-native-document-picker';
import {notifyMessageToOtherMembers} from '../utils/SendMessage';

const ChatTextInput = ({accessTokens, memberId, userInfo}) => {
  const [newMessage, setNewMessage] = useState('');
  const {socket, currentConversation, setCurrentConversation} = useSocket();

  const getConversationId = async accessToken => {
    if (!currentConversation._id) {
      const newConversation = await createConversation(
        memberId._id,
        accessToken,
      );

      const updateConversation = {
        ...currentConversation,
        _id: newConversation.data.conversation_id,
      };

      setCurrentConversation(updateConversation);

      return newConversation.data.conversation_id;
    }
    return currentConversation._id;
  };

  const handleSendMessage = async () => {
    let conversationID = await getConversationId(accessTokens.accessToken);
    handleMessage(conversationID, newMessage, 1);
    setNewMessage('');
  };

  const handleSelectImage = () => {
    ImagePicker.openPicker({multiple: true, cropping: false})
      .then(images => {
        images.map(async image => {
          let conversationID = await getConversationId(
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

  const handleSelectDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
        allowMultiSelection: true,
      });
      results.forEach(async file => {
        let conversationID = await getConversationId(accessTokens.accessToken);

        await uploadFileToS3(file, conversationID);

        handleMessage(conversationID, file.name, 3);
      });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the document picker.');
      } else {
        console.error('Error while picking the document:', error);
      }
    }
  };

  const handleMessage = (conversationID, messageContent, type) => {
    const message = {
      conversation_id: conversationID,
      message: messageContent,
      type: type,
      created_at: new Date().getTime(),
    };

    socket.emit('message', message);

    notifyMessageToOtherMembers(message, currentConversation, userInfo);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
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
          disabled={!newMessage.trim()}
          style={{paddingHorizontal: 10}}>
          <Ionicons name="send" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
      ) : (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={handleSelectDocument}
            style={{padding: 10}}>
            <Ionicons name="attach" size={24} color={MAIN_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectImage} style={{padding: 10}}>
            <Ionicons name="image-outline" size={24} color={MAIN_COLOR} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ChatTextInput;
