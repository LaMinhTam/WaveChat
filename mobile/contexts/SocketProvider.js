import React, {createContext, useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import HOST_IP from '../apis/host';
import {useUserData} from './auth-context';
import {getConversations} from '../apis/conversation';
import {useNavigation} from '@react-navigation/native';

const SocketContext = createContext();
/**
 * 

export interface UserResponse {
  _id: string;
  role: string;
  full_name: string;
  avatar: string;
}


export type SocketCallUser {
  user_from: UserResponse;
  user_to: UserResponse;
  signal_data: any;
}
*/

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const {userInfo, accessTokens} = useUserData();
  const [currentConversation, setCurrentConversation] = useState({});
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const newSocket = io(`ws://${HOST_IP}:3000`, {
      extraHeaders: {
        Authorization: accessTokens,
      },
      query: {device: user._id},
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('disconnect', reason => {
      console.log('Disconnected from WebSocket. Reason:', reason);
    });

    newSocket.on('message', incomingMessage => {
      const {message} = incomingMessage;
      setMessages(prevMessages => [message, ...prevMessages]);
      console.log('Incoming message:', message);
      handleConversationOnIncomingMessage(message);
    });

    newSocket.on('request-call-video', incomingRequestCallVideo => {
      // console.log('Incoming call:', incomingRequestCallVideo);
      // const {user_from, user_to, signal_data} = incomingRequestCallVideo;
      // console.log(
      //   'Incoming call from:',
      //   user_from,
      //   'to:',
      //   user_to,
      //   'data:',
      //   signal_data,
      // );

      // TODO: Handle incoming call => navigate to call screen
      navigation.navigate('CallPhoneScreen', {
        data: incomingRequestCallVideo,
        type: 'call-from',
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleConversationOnIncomingMessage = async message => {
    let isNewConversation = true;
    setConversations(prevConversations => {
      return prevConversations.map(conversation => {
        if (conversation._id === message.conversation_id) {
          isExist = false;
          return {
            ...conversation,
            last_message: message,
            last_activity: message.created_at,
          };
        }
        return conversation;
      });
    });
    if (isNewConversation) {
      const conversation = await getConversations(accessTokens);
      setConversations(conversation.data);
    }
  };

  const contextValues = {
    socket,
    currentConversation,
    setCurrentConversation,
    conversations,
    setConversations,
    messages,
    setMessages,
  };
  return (
    <SocketContext.Provider value={contextValues}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};
