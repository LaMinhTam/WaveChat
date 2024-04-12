import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  getConversationDetail,
  getConversations,
  getListMember,
} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {formatTimeLastActivity} from '../utils/format-time-message.util';
import {FILE_TYPE} from '../constants';
import {getBlockList} from '../apis/user';

const HomeScreen = ({navigation}) => {
  const {conversations, setConversations, setCurrentConversation} = useSocket();
  const {accessTokens, userInfo} = useUserData();
  const [blockUser, setBlockUser] = useState([]);

  const constructMessage = (lastMessage, userInfo) => {
    const type = lastMessage.type;
    if (type != 1 && type != 14 && type != 16) {
      if (type === 2) {
        return `[${FILE_TYPE[type]}]`;
      } else {
        return `[${FILE_TYPE[type]}] ${lastMessage.media[0].split(';')[1]}`;
      }
    } else {
      const senderName =
        lastMessage.user._id === userInfo._id
          ? 'Bạn'
          : lastMessage.user.full_name;
      let message = `${senderName}: ${lastMessage.message}`;
      if (type === 14) {
        message = 'Tin nhắn đã được thu hồi';
      }
      return message;
    }
  };

  const LastMessage = item => {
    let message = constructMessage(item.item.last_message, userInfo);
    return <Text style={styles.lastMessage}>{message}</Text>;
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversation = await getConversations(accessTokens);
        setConversations(conversation.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

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

    fetchBlockList();
    fetchConversations();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {conversations
        .sort((a, b) => new Date(b.last_activity) - new Date(a.last_activity))
        .map(conversation => (
          <TouchableOpacity
            key={conversation._id}
            style={styles.conversationRow}
            onPress={async () => {
              const data = await getConversationDetail(
                conversation._id,
                accessTokens,
              );
              virtual_members = await getListMember(
                conversation._id,
                accessTokens,
              );
              setCurrentConversation({
                ...conversation,
                block_type: data.data.block_type,
                my_permission: data.data.my_permission,
                virtual_members: virtual_members.data,
              });
              navigation.navigate('ChatScreen');
            }}>
            <Image
              style={styles.avatar}
              source={{
                uri:
                  conversation.avatar ||
                  'https://wavechat.s3.ap-southeast-1.amazonaws.com/default-group-icon-dark.webp',
              }}
            />
            <View style={styles.infoColumn}>
              <View>
                <Text style={styles.name}>{conversation.name}</Text>
                <LastMessage item={conversation} />
              </View>
              <View style={styles.lastActivity}>
                <Text
                  style={{
                    color: '#73787C',
                    fontSize: 12,
                  }}>
                  {formatTimeLastActivity(conversation.last_activity)}
                </Text>
                {conversation.unread_count ? (
                  <Text
                    style={{
                      color: 'white',
                      backgroundColor: 'red',
                      textAlign: 'center',
                      borderRadius: 100,
                      marginHorizontal: 5,
                    }}>
                    {conversation.unread_count}
                  </Text>
                ) : (
                  ''
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 13},
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 12,
  },
  infoColumn: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_TEXT_COLOR,
  },
  lastActivity: {
    marginLeft: 'auto',
  },
  lastMessage: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default HomeScreen;
