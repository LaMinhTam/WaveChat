import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {useUserData} from '../contexts/auth-context';
import {MAIN_COLOR, PRIMARY_TEXT_COLOR, SECOND_COLOR} from '../styles/styles';
import {
  createGroupConversation,
  getConversationDetail,
  getConversations,
} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';
import FriendListChosen from '../components/FriendListChosen';

const CreateGroupScreen = ({navigation}) => {
  const {accessTokens, friends} = useUserData();
  const {setCurrentConversation, setConversations} = useSocket();
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleCreateGroup = async () => {
    const data = await createGroupConversation(
      groupName,
      selectedFriends.map(friend => friend.user_id),
      accessTokens,
    );

    const currentConversation = await getConversationDetail(
      data.data.conversation_id,
      accessTokens,
    );
    console.log('new currentConversation', currentConversation);
    setCurrentConversation(currentConversation.data);
    const conversation = await getConversations(accessTokens);
    setConversations(conversation.data);
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
      <FriendListChosen
        friends={friends}
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}></FriendListChosen>
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
        <Text style={{color: '#fff', fontWeight: 700, fontSize: 18}}>
          Tạo nhóm mới
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGroupScreen;
