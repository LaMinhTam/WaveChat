import {View, Text, FlatList, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {getConversationDetail} from '../apis/conversation';
import {useAuth} from '../contexts/auth-context';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import commonStyle, {
  MAIN_COLOR,
  PRIMARY_TEXT_COLOR,
  SECOND_COLOR,
} from '../styles/styles';
import {useSelector} from 'react-redux';
import {selectCurrentConversation} from '../store/chatSlice';
import {TruncatedText} from '../utils/TruncatedText';

const PrivateChatScreen = ({navigation}) => {
  const {userInfo, accessTokens} = useAuth();
  const conversation = useSelector(selectCurrentConversation);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      _id: '65bcba2367eb9b1777999253',
      created_at: 1707049365709,
      updated_at: 1707049365709,
      conversation_id: '65bc6457a732dac5bab21699',
      user_id: '65ba5e6d9df41eb9113415eb',
      user_target: [],
      message:
        '😄🥹tin nhắn đầu tiền. bên canh đó thì đây cũng là 1 tin nhắn đủ dài để test. Và để cẩn thân cẩn responsive lại cho đoạn này, cố gắng làm tin nhắn này dài thêm trong vô vọng để vượt quá 4 line',
      no_of_reaction: 0,
      type: 1,
      status: 1,
      user_tag: [],
      __v: 0,
    },
    {
      _id: '65bc92cd37dace55e7333ecf',
      created_at: 1706857014022,
      updated_at: 1706857014022,
      conversation_id: '65bc6457a732dac5bab21699',
      user_id: '65ba099fe5b15de630705064',
      user_target: [],
      message: 'tin nhắn đầu tiền',
      no_of_reaction: 0,
      type: 1,
      status: 1,
      user_tag: [],
      __v: 0,
    },
  ]);

  const attachInfoForMessage = () => {
    messages.map(message => {
      conversation.members.map(member => {
        if (message.user_id === member._id) {
          message.avatar = member.avatar;
          message.full_name = member.full_name;
        }
      });
    });
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
          {conversation.name}
        </Text>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            marginRight: 10,
            gap: 20,
          }}>
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
    attachInfoForMessage();
    connectSocket();
  }, [accessTokens.accessToken, userInfo._id]);

  const connectSocket = () => {
    try {
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  const renderMessageItem = ({item}) => {
    const isCurrentUser = item.user_id === userInfo._id;

    const messageTime = new Date(item.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

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
            source={{uri: item.avatar}}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 10,
            }}
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
            {messageTime}
          </Text>
        </View>
        {isCurrentUser && (
          <Image
            source={{uri: item.avatar}}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginLeft: 10,
            }}
          />
        )}
      </View>
    );
  };

  const handleSendMessage = () => {
    try {
      if (socket) {
        const message = {
          conversation_id: conversation.conversation_id,
          message: newMessage,
          type: 1,
          created_at: '',
        };

        socket.emit('message-text', message);
      }
    } catch (error) {
      console.log('Error sending message:', error);
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
          onChangeText={text => setNewMessage(text)}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color={MAIN_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrivateChatScreen;
