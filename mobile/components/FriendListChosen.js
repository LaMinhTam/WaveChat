import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {BACKGROUND_COLOR} from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const FriendListChosen = ({friends, selectedFriends, setSelectedFriends}) => {
  const [searchText, setSearchText] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.full_name.toLowerCase().includes(searchText.toLowerCase()),
  );

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

  return (
    <View style={{flex: 1}}>
      <TextInput
        style={{
          padding: 10,
          marginBottom: 10,
          backgroundColor: BACKGROUND_COLOR,
        }}
        placeholder="Tìm tên"
        placeholderTextColor={'gray'}
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
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
            <Text style={{color: '#333'}}>{item.full_name}</Text>
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
    </View>
  );
};

export default FriendListChosen;
