import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSocket} from '../contexts/SocketProvider';
import {getConversations} from '../apis/conversation';
import {useUserData} from '../contexts/auth-context';

const HomeScreen = ({navigation}) => {
  const {conversations, setConversations, setCurrentConversation} = useSocket();
  const {accessTokens} = useUserData();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversation = await getConversations(accessTokens.accessToken);
        setConversations(conversation.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const formatLastActivity = timestamp => {
    const now = new Date();
    const activityDate = new Date(timestamp);

    const timeDiffInMilliseconds = now - activityDate;
    const timeDiffInMinutes = Math.floor(timeDiffInMilliseconds / (1000 * 60));
    const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);

    const optionsDate = {day: '2-digit', month: '2-digit', year: '2-digit'};
    const optionsMonth = {day: '2-digit', month: '2-digit'};

    if (timeDiffInHours >= 24) {
      return now.getFullYear() !== activityDate.getFullYear()
        ? activityDate
            .toLocaleDateString('vi-VN', optionsDate)
            .replace(/-/g, '/')
        : activityDate
            .toLocaleDateString('vi-VN', optionsMonth)
            .replace(/-/g, '/');
    } else if (timeDiffInMinutes >= 60) {
      return `${timeDiffInHours} giờ`;
    } else {
      return `${timeDiffInMinutes} phút`;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {conversations.map(conversation => (
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
              uri: conversation.avatar || 'https://source.unsplash.com/random',
            }}
          />

          <View style={styles.infoColumn}>
            <Text style={styles.name}>{conversation.name}</Text>
            <Text style={styles.lastActivity}>
              {formatLastActivity(conversation.last_activity)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
});

export default HomeScreen;
