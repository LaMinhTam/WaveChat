import React, {createContext, useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import HOST_IP from '../apis/host';
import {useUserData} from './auth-context';
import {
  getConversationDetail,
  getConversations,
  getListMember,
  getMessage,
} from '../apis/conversation';
import {useNavigation} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import {updateUnreadTrack} from '../utils/firestoreManage';
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
      query: {device: userInfo._id},
    });

    newSocket.on('connect', () => {
      firestore()
        .collection('unreadTrack')
        .doc(userInfo._id)
        .onSnapshot(doc => {
          if (doc.exists) {
            const unreadMessages = doc.data();
            setConversations(prevConversations =>
              prevConversations.map(conversation => {
                const unreadCount = unreadMessages[conversation._id] || 0;
                return {
                  ...conversation,
                  unread_count: unreadCount,
                };
              }),
            );
          }
        });
      console.log('Connected to WebSocket');
    });

    newSocket.on('disconnect', reason => {
      console.log('Disconnected from WebSocket. Reason:', reason);
    });

    newSocket.on('message', incomingMessage => {
      const {message} = incomingMessage;
      console.log('incomingMessage', message);
      if (
        currentConversation._id === message.conversation_id ||
        currentConversation._id
      ) {
        setMessages(prevMessages => [message, ...prevMessages]);
      }
      handleConversationOnIncomingMessage(message);
    });

    newSocket.on('revoke-message', incomingMessage => {
      const {message} = incomingMessage;

      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(prevMessage => {
          if (prevMessage._id === message._id) {
            return message;
          }
          return prevMessage;
        });
        return updatedMessages;
      });
    });

    newSocket.on('new-conversation', data => {
      handleNewConversation();
    });

    const handleNewConversation = async () => {
      const conversation = await getConversations(accessTokens);
      setConversations(conversation.data);
    };

    const fetchConversations = async () => {
      try {
        const conversation = await getConversations(accessTokens);
        setConversations(conversation.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    newSocket.on('leave-group', data => {
      handleNewConversation();
      console.log('leave', data.data);
      if (
        currentConversation !== undefined ||
        currentConversation._id === data.data.conversation_id
      ) {
        currentConversation.members = currentConversation.members.filter(
          member => member._id !== data.data.user_id,
        );
        currentConversation.virtual_members =
          currentConversation.virtual_members.filter(
            member => member._id !== data.data.user_id,
          );
        setCurrentConversation(currentConversation);
      } else {
        fetchConversations();
      }
    });

    newSocket.on('add-member', data => {
      fetchConversations();
    });

    newSocket.on('remove-member', data => {
      fetchConversations();
    });

    newSocket.on('disband-group', data => {
      fetchConversations();
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
      const updatedConversations = prevConversations.map(conversation => {
        if (conversation._id === message.conversation_id) {
          isNewConversation = false;
          let count = 0;
          if (message.user._id !== userInfo._id) {
            count = conversation.unread_count
              ? conversation.unread_count + 1
              : 1;
            updateUnreadTrack(userInfo._id, conversation._id, count);
          }
          return {
            ...conversation,
            unread_count: count,
            last_message: message,
            last_activity: message.created_at,
          };
        }
        return conversation;
      });
      return updatedConversations;
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
