import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImageCropPicker from 'react-native-image-crop-picker';
import {MAIN_COLOR, PRIMARY_TEXT_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';
import {
  deleteConversation,
  getMembers,
  leaveGroup,
  removeMember,
  toggleNotification,
} from '../apis/conversation';
import {blockUser, getBlockList, removeBlock} from '../apis/user';
import {setCurrentConversation} from '../store/chatSlice';

const ChatControlPanel = ({navigation}) => {
  const {userInfo, friends, setFriends, accessTokens} = useUserData();
  const {
    currentConversation,
    setCurrentConversation,
    messages,
    setConversations,
  } = useSocket();
  const [members, setMembers] = useState([]);
  const [isMemberCollapsed, setIsMemberCollapsed] = useState(true);
  const [isBlockUser, setIsBlockUser] = useState(false);
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    if (currentConversation._id !== undefined) {
      const data = await getMembers(currentConversation._id, accessTokens);
      const members = data.data.map(member => {
        if (member._id === userInfo._id) {
          return {...member, avatar: userInfo.avatar};
        }
        return member;
      });
      setMembers(members);
    } else {
      setMembers(currentConversation.virtual_members);
    }

    const blocks = await getBlockList(accessTokens);
    const blockList = blocks.data;
    const isBlock = blockList.some(
      block =>
        block.user_block_id._id === currentConversation.members[0] ||
        block.user_block_id._id === currentConversation.members[1],
    );
    setIsBlockUser(isBlock);
  };

  const mediaMessage = messages
    ?.filter(message => message.type === 2 || message.type === 3)
    .flatMap(message => message.media);

  const viewUserPage = () => {
    const userIds = currentConversation.members;
    navigation.navigate('UserInfomation', {userIds});
  };

  const addMember = () => {
    navigation.navigate('AddMember');
  };

  const renderImageItem = ({item}) => (
    <View style={styles.imageContainer}>
      {item.startsWith('image') && (
        <Image
          source={{
            uri: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${
              currentConversation._id
            }/images/${item.split(';')[1]}`,
          }}
          style={styles.image}
        />
      )}
    </View>
  );

  const renderRightArrow = () => (
    <View
      style={[
        styles.imageContainer,
        styles.image,
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: MAIN_COLOR,
        },
      ]}>
      <FeatherIcon name="chevron-right" size={30} color={'#fff'} />
    </View>
  );

  const handleRemoveMember = async memberId => {
    const data = await removeMember(
      currentConversation._id,
      memberId,
      accessTokens,
    );
    if (data.status === 200) {
      setMembers(members.filter(member => member._id !== memberId));
    }
  };

  const handleLeaveGroup = async () => {
    const data = await leaveGroup(currentConversation._id, accessTokens);
    setConversations(prevConversations =>
      prevConversations.filter(
        conversation => conversation._id !== currentConversation._id,
      ),
    );

    if (data.status === 200) {
      navigation.navigate('HomeScreen');
    }
  };

  const handleDeleteConversation = async () => {
    const data = await deleteConversation(
      currentConversation._id,
      accessTokens,
    );
    console.log(data);
    setConversations(prevConversations =>
      prevConversations.filter(
        conversation => conversation._id !== currentConversation._id,
      ),
    );
    navigation.navigate('HomeScreen');
  };

  const handleBlockUser = async () => {
    const otherMember = members.filter(member => member._id !== userInfo._id);
    let data;
    if (isBlockUser) {
      data = await removeBlock(otherMember[0]._id, accessTokens);
      setIsBlockUser(false);
    } else {
      data = await blockUser(otherMember[0]._id, accessTokens);
      setFriends(
        friends.filter(friend => friend.user_id !== otherMember[0]._id),
      );
      setCurrentConversation({...currentConversation, block_type: 1});
      setIsBlockUser(true);
    }
    Alert.alert('Thông báo', data.data);
  };

  const handleToggleNotification = async () => {
    const data = await toggleNotification(
      currentConversation._id,
      accessTokens,
    );
    console.log(data);
  };

  const mediaMessageForSection = messages?.filter(
    message => message.type === 2 || message.type === 3,
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              currentConversation.avatar ||
              'https://wavechat.s3.ap-southeast-1.amazonaws.com/default-group-icon-dark.webp',
          }}
          style={styles.avatar}
        />
      </View>
      <Text style={styles.conversationName}>{currentConversation.name}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ChatScreen', {isSearch: true});
          }}>
          <View style={styles.iconContainer}>
            <FeatherIcon name="search" size={24} color="#000" />
          </View>
          <Text style={styles.buttonText}>Tìm tin nhắn</Text>
        </TouchableOpacity>
        {currentConversation.type === 2 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => viewUserPage()}>
            <View style={styles.iconContainer}>
              <FeatherIcon name="user" size={24} color="#000" />
            </View>
            <Text style={styles.buttonText}>Trang cá nhân</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => addMember()}>
            <View style={styles.iconContainer}>
              <FeatherIcon name="user-plus" size={24} color="#000" />
            </View>
            <Text style={styles.buttonText}>Thêm thành viên</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            ImageCropPicker.openPicker({multiple: false, cropping: true}).then(
              image => {
                console.log(image);
              },
            );
          }}>
          <View style={styles.iconContainer}>
            <FeatherIcon name="image" size={24} color="#000" />
          </View>
          <Text style={styles.buttonText}>Đổi hình nền</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleToggleNotification();
          }}>
          <View style={styles.iconContainer}>
            <FeatherIcon name="bell-off" size={24} color="#000" />
          </View>
          <Text style={styles.buttonText}>Tắt thông báo</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.memberSection}
        onPress={() => setIsMemberCollapsed(!isMemberCollapsed)}>
        <Text style={styles.sectionName}>Thành viên ({members.length})</Text>
        <FeatherIcon
          name={isMemberCollapsed ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={PRIMARY_TEXT_COLOR}
        />
      </TouchableOpacity>
      {!isMemberCollapsed && (
        <View style={styles.memberList}>
          {members.map(member => (
            <View
              key={member._id}
              onPress={() => console.log(member)}
              style={styles.memberItem}>
              <Image
                source={{uri: member.avatar}}
                style={styles.memberAvatar}
              />
              <Text style={{color: '#000'}}>{member.full_name}</Text>
              {member._id != userInfo._id &&
                currentConversation.owner_id === userInfo._id && (
                  <TouchableOpacity
                    style={{marginLeft: 'auto'}}
                    onPress={() => {
                      handleRemoveMember(member._id);
                    }}>
                    <FeatherIcon name="trash" size={20} color="red" />
                  </TouchableOpacity>
                )}
            </View>
          ))}
        </View>
      )}
      {mediaMessage.length > 0 && (
        <TouchableOpacity
          style={styles.imageSection}
          onPress={() =>
            navigation.navigate('ImagesScreen', {mediaMessageForSection})
          }>
          <Text style={styles.sectionName}>Ảnh</Text>
          <FlatList
            data={mediaMessage.slice(0, 3)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImageItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={renderRightArrow}
            contentContainerStyle={styles.imageList}
          />
        </TouchableOpacity>
      )}
      {currentConversation.type === 1 && (
        <TouchableOpacity
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
          onPress={() => {
            handleLeaveGroup();
          }}>
          <Text
            style={[
              styles.buttonText,
              {color: 'red', fontSize: 18, fontWeight: 700},
            ]}>
            Rời nhóm
          </Text>
        </TouchableOpacity>
      )}
      {currentConversation.type === 2 && (
        <TouchableOpacity
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
          onPress={() => {
            handleBlockUser();
          }}>
          <Text
            style={[
              styles.buttonText,
              {color: 'red', fontSize: 18, fontWeight: 700},
            ]}>
            {isBlockUser ? 'Bỏ chặn người dùng' : 'Chặn người dùng'}
          </Text>
        </TouchableOpacity>
      )}
      {currentConversation.type === 2 && (
        <TouchableOpacity
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
          onPress={() => {
            handleDeleteConversation();
          }}>
          <Text
            style={[
              styles.buttonText,
              {color: 'red', fontSize: 18, fontWeight: 700},
            ]}>
            Xóa cuộc trò chuyện
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  conversationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: PRIMARY_TEXT_COLOR,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    alignContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    marginLeft: 10,
    color: PRIMARY_TEXT_COLOR,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSection: {
    width: '100%',
  },
  sectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: PRIMARY_TEXT_COLOR,
  },
  imageList: {
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 10,
    opacity: 0.8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  memberSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  memberList: {
    marginTop: 5,
    width: '100%',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  imageSection: {
    width: '100%',
  },
});

export default ChatControlPanel;