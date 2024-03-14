import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useUserData} from '../contexts/auth-context';
import {
  BACKGROUND_COLOR,
  MAIN_COLOR,
  PRIMARY_TEXT_COLOR,
  SECOND_COLOR,
} from '../styles/styles';
import {
  createGroupConversation,
  getConversationDetail,
} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';

const CreateGroupScreen = ({navigation}) => {
  const {accessTokens, friends} = useUserData();
  const {setCurrentConversation, setConversations} = useSocket();
  const [groupName, setGroupName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleFriendSelection = friend => {
    const index = selectedFriends.findIndex(
      selectedFriend => selectedFriend.user_id === friend.user_id,
    );
    if (index !== -1) {
      const updatedSelectedFriends = [...selectedFriends];
      updatedSelectedFriends.splice(index, 1);
      setSelectedFriends(updatedSelectedFriends);
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.full_name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleCreateGroup = async () => {
    const data = await createGroupConversation(
      groupName,
      selectedFriends.map(friend => friend.user_id),
      accessTokens,
    );

    let currentConversation = {
      ...(await getConversationDetail(data.data.conversation_id, accessTokens)),
      _id: data.data.conversation_id,
    };
    setCurrentConversation(currentConversation);
    setConversations(prevConversations => {
      return [currentConversation, ...prevConversations];
    });
    navigation.pop();
    navigation.navigate('ChatScreen');
  };

  return (
    <View style={{flex: 1, padding: 20, backgroundColor: SECOND_COLOR}}>
      <TextInput
        style={{
          borderBottomWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
        }}
        placeholder="Đặt tên nhóm"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={{
          padding: 10,
          marginBottom: 10,
          backgroundColor: BACKGROUND_COLOR,
        }}
        placeholder="Tìm tên"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredFriends}
        keyExtractor={item => item.user_id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
            onPress={() => handleFriendSelection(item)}>
            <Image
              source={{uri: item.avatar}}
              style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
            />
            <Text>{item.full_name}</Text>
            {selectedFriends.some(
              selectedFriend => selectedFriend.user_id === item.user_id,
            ) ? (
              <Icon
                name="check-circle"
                size={20}
                color="green"
                style={{marginLeft: 'auto'}}
              />
            ) : (
              <Icon
                name="circle-o"
                size={20}
                color="gray"
                style={{marginLeft: 'auto'}}
              />
            )}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={{
          backgroundColor: MAIN_COLOR,
          opacity:
            groupName.length > 0 && selectedFriends.length >= 2 ? 1 : 0.5,
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={() => {
          handleCreateGroup();
        }}
        disabled={!groupName.length > 0 || selectedFriends.length < 2}>
        <Text style={{color: PRIMARY_TEXT_COLOR}}>Tạo nhóm mới</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGroupScreen;
