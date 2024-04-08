import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PRIMARY_TEXT_COLOR, MAIN_COLOR, SECOND_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {createConversation} from '../apis/conversation';
import ImagePicker from 'react-native-image-crop-picker';
import {sendImageMessage, uploadFileToS3} from '../utils/S3Bucket';
import DocumentPicker from 'react-native-document-picker';
import {notifyMessageToOtherMembers} from '../utils/SendMessage';
import {handleConvertFileTypeToNumber} from '../constants';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EmojiPicker from 'rn-emoji-keyboard';
const ChatTextInput = ({
  accessTokens,
  memberId,
  userInfo,
  replyTo,
  setReplyTo,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const {socket, currentConversation, setCurrentConversation} = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  function handleFileType(fileName) {
    const fileType = fileName.split('.');
    const type = fileType[fileType.length - 1];
    const typeNumber = handleConvertFileTypeToNumber(type);
    return typeNumber;
  }

  const getConversationId = async accessToken => {
    if (!currentConversation._id) {
      const newConversation = await createConversation(
        memberId[0],
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
    let conversationID = await getConversationId(accessTokens);
    setNewMessage('');
    if (replyTo) {
      console.log('replyTo', replyTo);
      setReplyTo();
      handleReplyMessage(conversationID, newMessage, replyTo, 6);
    } else {
      handleMessage(conversationID, newMessage, 1);
    }
  };

  const handleSelectImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: false,
      mediaType: 'photo',
    })
      .then(async images => {
        const timestamp = new Date().getTime();
        let media = [];
        let conversationID = await getConversationId(accessTokens);
        images.map(async image => {
          if (image.size > 1000000000) {
            Alert.alert('Lỗi', 'File size is too large');
            return;
          }
          media.push(
            `${image.mime};${timestamp}-${image.path.split('/').pop()};${
              image.size
            }`,
          );
          sendImageMessage(
            image,
            conversationID,
            `${timestamp}-${image.path.split('/').pop()}`,
          );
        });
        handleMessage(conversationID, '', 2, media);
      })
      .catch(error => {});
  };

  const handleSelectDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
        allowMultiSelection: true,
      });
      results.forEach(async file => {
        if (file.size > 1000000000) {
          Alert.alert('Lỗi', 'File size is too large');
          return;
        }
        const timestamp = new Date().getTime();
        let type = handleFileType(file.name);
        let conversationID = await getConversationId(accessTokens);
        uploadFileToS3(file, conversationID, `${timestamp}-${file.name}`);
        const media = `${file.type};${timestamp}-${file.name};${file.size}`;
        handleMessage(conversationID, '', type, media);
      });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the document picker.');
      } else {
        console.error('Error while picking the document:', error);
      }
    }
  };

  const handleMessage = (conversationID, messageContent, type, files) => {
    const message = {
      conversation_id: conversationID,
      message: messageContent,
      type: type,
      created_at: new Date().getTime(),
      ...(files && {media: files}),
    };
    console.log(message);
    socket.emit('message', message);

    notifyMessageToOtherMembers(message, currentConversation, userInfo);
  };

  const handleReplyMessage = (
    conversationID,
    messageContent,
    replyMessage,
    type,
    files,
  ) => {
    const message = {
      conversation_id: conversationID,
      message: messageContent,
      type: type,
      created_at: new Date().getTime(),
      message_reply_id: replyMessage._id,
      ...(files && {media: files}),
    };
    console.log('type', message);
    socket.emit('message', message);

    // notifyMessageToOtherMembers(message, currentConversation, userInfo);
  };

  return (
    <View>
      {replyTo && (
        <View
          style={{
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderColor: '#ccc',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            padding: 10,
          }}>
          <Text
            style={{
              color: '#888',
            }}>
            Trả lời: {replyTo.type === 1 ? replyTo.message : 'Tệp đính kèm'}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setReplyTo();
            }}>
            <FeatherIcon name="x-circle" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      )}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
              style={{padding: 10}}>
              <Ionicons name="send" size={24} color={MAIN_COLOR} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log(!isOpen);
                setIsOpen(!isOpen);
              }}
              style={{padding: 10}}>
              <Ionicons name="happy" size={24} color={MAIN_COLOR} />
            </TouchableOpacity>
          </View>
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
            <TouchableOpacity
              onPress={() => setIsOpen(!isOpen)}
              style={{padding: 10}}>
              <Ionicons name="happy" size={24} color={MAIN_COLOR} />
            </TouchableOpacity>
          </View>
        )}
        <EmojiPicker
          onEmojiSelected={emoji => {
            setNewMessage(prevMessage => prevMessage + emoji.emoji);
          }}
          open={isOpen}
          onClose={() => setIsOpen(false)}></EmojiPicker>
      </View>
    </View>
  );
};

export default ChatTextInput;
