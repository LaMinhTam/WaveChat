import React, {useEffect, useState, useRef} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {getMessage} from '../apis/conversation';
import ChatTextInput from '../components/ChatTextInput';
import Message from '../components/Message';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';
import SearchMessages from '../components/SearchMessages';
import MessageItem from '../components/MessageItem';

const ChatScreen = ({navigation, route}) => {
  const {userInfo, accessTokens} = useUserData();
  const {currentConversation, messages, setMessages} = useSocket();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const flatListRef = useRef(null);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
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
  }, []);

  useEffect(() => {
    scrollToMessage(searchKeyword);
  }, [searchKeyword]);

  const loadMessages = async () => {
    let newMessages = await getMessage(currentConversation._id, accessTokens);
    if (newMessages.data !== undefined) {
      setMessages(newMessages.data);
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

  const otherUser = currentConversation.members.find(
    member => member._id !== userInfo._id,
  );

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
          />
        )}
        inverted
        style={{padding: 5}}
      />
      <ChatTextInput
        accessTokens={accessTokens}
        memberId={otherUser}
        userInfo={userInfo}
      />
    </View>
  );
};

export default ChatScreen;
