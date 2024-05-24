import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getBlockList, removeBlock} from '../apis/user';
import {useUserData} from '../contexts/auth-context';
import FriendListChosen from '../components/FriendListChosen';
import {BACKGROUND_COLOR, MAIN_COLOR} from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const BlockScreen = () => {
  const {accessTokens} = useUserData();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [blockUser, setBlockUser] = useState([]);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    fetchBlockList();
  }, []);

  const fetchBlockList = async () => {
    const data = await getBlockList(accessTokens);
    const result = data.data.map(block => {
      return {
        ...block.user_block_id,
        created_at: block.created_at,
        updated_at: block.updated_at,
        user_id: block.user_id,
      };
    });
    setBlockUser(result);
  };

  const filteredFriends = blockUser.filter(friend =>
    friend.full_name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleFriendSelection = async friend => {
    const data = await removeBlock(friend._id, accessTokens);
    console.log(friend, data);
    setBlockUser(prevBlockUser =>
      prevBlockUser.filter(block => block._id !== friend._id),
    );
  };

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#fff'}}>
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
          <View
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
            <Text style={{color: '#000'}}>{item.full_name}</Text>
            <TouchableOpacity
              style={{
                marginLeft: 'auto',
                backgroundColor: '#ccc',
                padding: 5,
                borderRadius: 15,
              }}
              onPress={() => handleFriendSelection(item)}>
              <Text style={{color: '#000', paddingHorizontal: 10}}>
                Bỏ chặn
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default BlockScreen;
