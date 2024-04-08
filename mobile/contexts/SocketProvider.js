import React, {createContext, useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import HOST_IP from '../apis/host';
import {useUserData} from './auth-context';
import {getConversations} from '../apis/conversation';
import firestore from '@react-native-firebase/firestore';
import {updateUnreadTrack} from '../utils/firestoreManage';
const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const {userInfo, accessTokens} = useUserData();
  const [currentConversation, setCurrentConversation] = useState({});
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

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
      console.log('message', message);
      console.log(currentConversation._id, '\n', message.conversation_id);
      // if (
      //   currentConversation._id === message.conversation_id ||
      //   currentConversation._id
      // ) {
      setMessages(prevMessages => [message, ...prevMessages]);
      // }
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
