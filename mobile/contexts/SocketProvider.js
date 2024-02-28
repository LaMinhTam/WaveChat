import React, {createContext, useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import HOST_IP from '../apis/host';
import {useUserData} from './auth-context';

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const {userInfo} = useUserData();
  const [currentConversation, setCurrentConversation] = useState({});
  const [conversations, setConversations] = useState([
    {
      conversation_id: '65bc6457a732dac5bab21699',
      name: '',
      is_pinned: 0,
      is_notify: 0,
      is_hidden: 0,
      is_confirm_new_member: 0,
      no_of_member: 2,
      no_of_not_seen: 0,
      no_of_waiting_confirm: 0,
      my_permission: 0,
      avatar: '',
      background: '',
      members: [
        {
          _id: '65ba099fe5b15de630705064',
          avatar: 'https://source.unsplash.com/random',
          full_name: 'La Minh Tâm',
        },
        {
          _id: '65ba5e6d9df41eb9113415eb',
          avatar: 'https://source.unsplash.com/random',
          full_name: 'Andy',
        },
      ],
      position: 1706845271285.1743,
      created_at: 1706844708502,
      updated_at: 1706844708502,
      last_activity: 1706845271285.1743,
      last_connect: '',
    },
  ]);
  const [messages, setMessages] = useState([
    {
      __v: 0,
      _id: '65c4846261eac527aae4ea2b',
      avatar: 'https://source.unsplash.com/random',
      conversation_id: '65c3a01ba55a53c2577830d5',
      created_at: 1707377762073,
      full_name: 'La Minh Tâm',
      message: 'CV_Internship_Software_Developer_PhamHoangAn.pdf',
      no_of_reaction: 0,
      status: 1,
      type: 5,
      updated_at: 1707375223069,
      user_id: '65c32619a55a53c257782d3e',
      user_tag: [],
      user_target: [],
    },
  ]);
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
