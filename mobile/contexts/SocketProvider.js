import React, {createContext, useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import HOST_IP from '../apis/host';
import {useUserData} from './auth-context';

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const {userInfo} = useUserData();
  const [currentConversation, setCurrentConversation] = useState({});
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const user = userInfo;

    const newSocket = io(`ws://${HOST_IP}:3000`, {
      extraHeaders: {
        Authorization: user.access_token,
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

      // setConversations(prevConversations => {
      //   return prevConversations.map(conversation => {
      //     if (conversation.conversation_id === message.conversation_id) {
      //       return {
      //         ...conversation,
      //         messages: [...(conversation.messages || []), message],
      //       };
      //     }
      //     return conversation;
      //   });
      // });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
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