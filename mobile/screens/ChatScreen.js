import React, {useEffect, useState, useRef} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {deleteMessage, getMessage, reactToMessage} from '../apis/conversation';
import ChatTextInput from '../components/ChatTextInput';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';
import SearchMessages from '../components/SearchMessages';
import MessageItem from '../components/MessageItem';
import {updateUnreadTrack} from '../utils/firestoreManage';

const ChatScreen = ({navigation, route}) => {
  const {userInfo, accessTokens} = useUserData();
  const {
    socket,
    currentConversation,
    setCurrentConversation,
    setConversations,
    messages,
    setMessages,
  } = useSocket();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const {socket} = useSocket();
  const [replyTo, setReplyTo] = useState();
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            setCurrentConversation({...currentConversation, _id: ''});
            setMessages([]);
          }}>
          <FeatherIcon
            name="arrow-left"
            size={24}
            color="#fff"
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Text style={{fontSize: 16, fontWeight: '700', color: '#fff'}}>
          {currentConversation.name}
        </Text>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row', marginRight: 10, gap: 20}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatControlPanel')}>
            <FeatherIcon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
    loadMessages();
    resetUnreadCount();
  }, []);

  useEffect(() => {
    scrollToMessage(searchKeyword);
  }, [searchKeyword]);

  const resetUnreadCount = () => {
    setConversations(prevConversations => {
      return prevConversations.map(conversation => {
        if (conversation._id === currentConversation._id) {
          updateUnreadTrack(userInfo._id, conversation._id, 0);
          return {
            ...conversation,
            unread_count: 0,
          };
        }
        return conversation;
      });
    });
  };
  const handleCall = () => {
    if (currentConversation.type == 2) {
      const data = {
        target_user_id: currentConversation.members.find(
          member => member !== userInfo._id,
        ),
        signal_data: {},
        message: 'call to user_id' + currentConversation.members[1]._id,
        name: currentConversation.name,
      };

      socket.emit('send-call-request', data);

      navigation.navigate('CallPhoneScreen', {data: data, type: 'call-to'});
      console.log('handleCall ~ data:', data);
    }
  };

  const loadMessages = async () => {
    let newMessages = await getMessage(currentConversation._id, accessTokens);
    if (newMessages.status === 200) {
      const filteredMessages = newMessages.data.filter(message => {
        return !message.user_deleted.includes(userInfo._id);
      });
      setMessages(filteredMessages);
    } else {
      setMessages([]);
    }
  };

  const scrollToMessage = keyword => {
    if (keyword.trim() !== '' && messages.length > 0) {
      const results = messages.filter(message =>
        message.message.toLowerCase().includes(keyword.toLowerCase()),
      );
      setSearchResults(results);
      if (results.length > 0) {
        const indexes = results.map(result =>
          messages.findIndex(msg => msg._id === result._id),
        );
        setSearchResults(indexes);
        setCurrentIndex(0);
        flatListRef.current.scrollToIndex({index: indexes[0]});
      }
    }
  };

  const scrollById = id => {
    const index = messages.findIndex(msg => msg._id === id);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({index});
    }
  };

  const handleNextResult = () => {
    if (currentIndex !== null && currentIndex < searchResults.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({index: searchResults[nextIndex]});
    }
  };

  const handlePrevResult = () => {
    if (currentIndex !== null && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({index: searchResults[prevIndex]});
    }
  };

  const otherUser = currentConversation?.members?.filter(
    member => member !== userInfo._id,
  );

  const handleOptionSelect = async (option, message) => {
    if (option === 'Thu hồi') {
      socket.emit('revoke-message', {
        message_id: message._id,
        conversation_id: message.conversation_id,
      });
    } else if (option === 'Xóa') {
      const data = await deleteMessage(message._id);
      console.log(data);
      if (messages[0]._id === message._id) {
        console.log('deleted last', messages[1]);
        setCurrentConversation(prevConversation => ({
          ...prevConversation,
          last_message: messages[1],
        }));
        setConversations(prevConversations =>
          prevConversations.map(conversation =>
            conversation._id === currentConversation._id
              ? {...conversation, last_message: messages[1]}
              : conversation,
          ),
        );
      }
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg._id !== message._id),
      );
    } else if (option === 'Chuyển tiếp') {
      navigation.navigate('ForwardMessage', {message_id: message._id});
    } else if (option === 'Trả lời tin nhắn') {
      messages.map(msg => {
        if (msg._id === message._id) {
          console.log('msg', msg);
          setReplyTo(msg);
        }
      });
    }
    // console.log('Option selected: ', option, 'Message ID: ', message);
  };

  const handleReactToMessage = async messageId => {
    const data = await reactToMessage(messageId);

    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg._id === messageId) {
          const userReactionExists = (msg.reaction || []).some(
            react => react.user_id === userInfo._id,
          );

          return {
            ...msg,
            reaction: userReactionExists
              ? (msg.reaction || []).filter(
                  react => react.user_id !== userInfo._id,
                )
              : [...(msg.reaction || []), {type: 1, user_id: userInfo._id}],
          };
        } else {
          return msg;
        }
      }),
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#e4f2eb'}}>
      {route.params?.isSearch && (
        <SearchMessages
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          handlePrevResult={handlePrevResult}
          handleNextResult={handleNextResult}
          currentIndex={currentIndex}
          searchResults={searchResults}
          turnOffSearch={() => {
            setSearchKeyword('');
            setSearchResults([]);
          }}
        />
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <MessageItem
            item={item}
            searchKeyword={searchKeyword}
            userInfo={userInfo}
            handleOptionSelect={handleOptionSelect}
            handleReactToMessage={handleReactToMessage}
            scrollById={scrollById}
          />
        )}
        inverted
        style={{padding: 5}}
      />
      {currentConversation.block_type === 2 && (
        <Text style={{textAlign: 'center', color: '#000'}}>
          Bạn đã bị người dùng này chặn
        </Text>
      )}
      {currentConversation.block_type === 1 && (
        <Text style={{textAlign: 'center', color: '#000'}}>
          Bạn đã chặn người dùng này
        </Text>
      )}
      {currentConversation.block_type === 0 && (
        <ChatTextInput
          accessTokens={accessTokens}
          memberId={otherUser}
          userInfo={userInfo}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
        />
      )}
    </View>
  );
};

export default ChatScreen;
