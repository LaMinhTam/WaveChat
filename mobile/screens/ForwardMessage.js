import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useUserData} from '../contexts/auth-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BACKGROUND_COLOR, MAIN_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {forwardMessage} from '../apis/conversation';

const ForwardMessage = ({navigation, route}) => {
  const messageId = route.params.message_id;
  console.log(messageId);
  const {accessTokens} = useUserData();
  const {conversations} = useSocket();
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [searchText, setSearchText] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleConversationSelection = conversation => {
    const index = selectedConversations.findIndex(
      selectedConversation => selectedConversation._id === conversation._id,
    );
    if (index !== -1) {
      const updatedSelectedConversation = [...selectedConversations];
      updatedSelectedConversation.splice(index, 1);
      setSelectedConversations(updatedSelectedConversation);
    } else {
      setSelectedConversations([...selectedConversations, conversation]);
    }
  };

  const handleForwardMessage = async () => {
    const conversationIds = selectedConversations.map(
      conversation => conversation._id,
    );
    const data = await forwardMessage(messageId, conversationIds, accessTokens);
    console.log(data);
    navigation.goBack();
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
        placeholderTextColor={'#000'}
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredConversations}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
            onPress={() => handleConversationSelection(item)}>
            <Image
              source={{
                uri:
                  item.avatar ||
                  'https://wavechat.s3.ap-southeast-1.amazonaws.com/default-group-icon-dark.webp',
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
            <Text style={{color: '#000'}}>{item.name}</Text>
            {selectedConversations.some(
              selectedConversation => selectedConversation._id === item._id,
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
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={() => {
          handleForwardMessage();
        }}>
        <Text style={{color: '#fff', fontWeight: 700, fontSize: 18}}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForwardMessage;
