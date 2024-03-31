import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getConversations} from '../apis/conversation';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {formatTimeLastActivity} from '../utils/format-time-message.util';
import {FILE_TYPE} from '../constants';

const HomeScreen = ({navigation}) => {
  const {conversations, setConversations, setCurrentConversation} = useSocket();
  const {accessTokens, userInfo} = useUserData();
  const constructMessage = (lastMessage, userInfo) => {
    const type = lastMessage.type;
    if (type != 1) {
      return `[${FILE_TYPE[type]}] ${lastMessage.media[0]}`;
    } else {
      const senderName =
        lastMessage.user._id === userInfo._id
          ? 'Bạn'
          : lastMessage.user.full_name;
      return `${senderName}: ${lastMessage.message}`;
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
            onPress={() => {
              setCurrentConversation(conversation);
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
              <Text style={styles.lastActivity}>
                {formatTimeLastActivity(conversation.last_activity)}
              </Text>
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
    color: '#73787C',
    fontSize: 12,
    marginLeft: 'auto',
  },
  lastMessage: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default HomeScreen;
