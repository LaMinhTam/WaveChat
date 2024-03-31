import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import FriendListChosen from '../components/FriendListChosen';
import {useUserData} from '../contexts/auth-context';
import {useSocket} from '../contexts/SocketProvider';
import {MAIN_COLOR, PRIMARY_TEXT_COLOR} from '../styles/styles';
import {addMember} from '../apis/conversation';

const AddMember = ({navigation}) => {
  const {accessTokens, friends} = useUserData();
  const {currentConversation} = useSocket();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendForAddToConversation, setFriendForAddToConversation] = useState(
    [],
  );
  useEffect(() => {
    const newFriendsMember = friends.filter(friend => {
      return !currentConversation.members.includes(friend.user_id);
    });
    setFriendForAddToConversation(newFriendsMember);
  }, []);

  const handleAddMember = async () => {
    const userIds = selectedFriends.map(friend => friend.user_id);
    const data = await addMember(
      currentConversation._id,
      userIds,
      accessTokens,
    );
    console.log(data);
    navigation.navigate('ChatControlPanel');
  };

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#fff'}}>
      <FriendListChosen
        friends={friendForAddToConversation}
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFriends}></FriendListChosen>
      <TouchableOpacity
        style={{
          backgroundColor: MAIN_COLOR,
          opacity: selectedFriends.length >= 1 ? 1 : 0.5,
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={() => {
          handleAddMember();
        }}
        disabled={!selectedFriends.length > 0}>
        <Text style={{color: '#fff', fontWeight: 700, fontSize: 18}}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddMember;
