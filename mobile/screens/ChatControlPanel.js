import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImageCropPicker from 'react-native-image-crop-picker';
import {MAIN_COLOR, PRIMARY_TEXT_COLOR} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';
import {useUserData} from '../contexts/auth-context';
import {
  acceptJoinByLink,
  deleteConversation,
  disbandConversation,
  leaveGroup,
  toggleNotification,
  updateName,
} from '../apis/conversation';
import {blockUser, getBlockList, removeBlock} from '../apis/user';
import MemberOptionsModal from '../components/MemberOptionsModal';
import EditGroupNameModal from '../components/EditGroupNameModal';

const ChatControlPanel = ({navigation}) => {
  const {userInfo, friends, setFriends, accessTokens} = useUserData();
  const {
    currentConversation,
    setCurrentConversation,
    messages,
    setConversations,
  } = useSocket();
  console.log(currentConversation._id);
  const [mediaMessage, setMediaMessage] = useState(
    messages
      ?.filter(message => message.type === 2 || message.type === 3)
      .flatMap(message => message.media),
  );
  const [isMemberCollapsed, setIsMemberCollapsed] = useState(true);
  const [isBlockUser, setIsBlockUser] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalRenameVisible, setIsModalRenameVisible] = useState(false);

  const handleLongPressMember = member => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const blocks = await getBlockList(accessTokens);
    const blockList = blocks.data;
    const isBlock = blockList.some(
      block =>
        block.user_block_id._id === currentConversation.members[0] ||
        block.user_block_id._id === currentConversation.members[1],
    );
    setIsBlockUser(isBlock);
  };

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
            uri: `${item.split(';')[3]}`,
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

  const handleLeaveGroup = async () => {
    const data = await leaveGroup(currentConversation._id, accessTokens);

    if (data.status === 200) {
      navigation.navigate('HomeScreen');
      setConversations(prevConversations =>
        prevConversations.filter(
          conversation => conversation._id !== currentConversation._id,
        ),
      );
    } else {
      Alert.alert('Thông báo', data.message);
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

  const handleDisbandConversation = async () => {
    const data = await disbandConversation(
      currentConversation._id,
      accessTokens,
    );

    setConversations(prevConversations =>
      prevConversations.filter(
        conversation => conversation._id !== currentConversation._id,
      ),
    );
    navigation.navigate('HomeScreen');
  };

  const handleBlockUser = async () => {
    const otherMember = currentConversation.members.filter(member =>
      console.log(member !== userInfo._id, member, userInfo._id),
    );
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

  const handleSaveNewName = async newName => {
    const data = await updateName(
      currentConversation._id,
      newName,
      accessTokens,
    );

    setCurrentConversation({...currentConversation, name: newName});
    setConversations(prevConversations =>
      prevConversations.map(conversation =>
        conversation._id === currentConversation._id
          ? {...conversation, name: newName}
          : conversation,
      ),
    );
  };

  return (
    <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}>
          <Text style={styles.conversationName}>
            {currentConversation.name}
          </Text>
          {currentConversation.type === 1 && (
            <TouchableOpacity onPress={() => setIsModalRenameVisible(true)}>
              <FeatherIcon
                style={{backgroundColor: '#eee', borderRadius: 20, padding: 5}}
                name="edit-3"
                size={20}
                color={'#000'}></FeatherIcon>
            </TouchableOpacity>
          )}
          <EditGroupNameModal
            visible={isModalRenameVisible}
            onClose={() => setIsModalRenameVisible(false)}
            onSave={handleSaveNewName}
          />
        </View>
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
              ImageCropPicker.openPicker({
                multiple: false,
                cropping: true,
              }).then(image => {
                console.log(image);
              });
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
          <Text style={styles.sectionName}>
            Thành viên ({currentConversation.virtual_members.length})
          </Text>
          <FeatherIcon
            name={isMemberCollapsed ? 'chevron-down' : 'chevron-up'}
            size={20}
            color={PRIMARY_TEXT_COLOR}
          />
        </TouchableOpacity>
        {!isMemberCollapsed && (
          <View style={styles.memberList}>
            {currentConversation.virtual_members.map(member => (
              <TouchableOpacity
                key={member._id}
                onPress={() => console.log(member)}
                onLongPress={() => handleLongPressMember(member)}
                style={styles.memberItem}>
                <Image
                  source={{uri: member.avatar}}
                  style={styles.memberAvatar}
                />
                <Text style={{color: '#000'}}>{member.full_name}</Text>
                <Text style={{marginLeft: 'auto', color: '#aaa'}}>
                  {member.permission === 1 ? 'Phó nhóm' : ''}
                  {member.permission === 2 ? 'Trưởng nhóm' : ''}
                </Text>
              </TouchableOpacity>
            ))}
            <MemberOptionsModal
              visible={isModalVisible}
              onClose={handleCloseModal}
              selectedMember={selectedMember}
              setCurrentConversation={setCurrentConversation}
              currentConversation={currentConversation}
              accessTokens={accessTokens}
              navigation={navigation}
              setConversations={setConversations}
              userId={userInfo._id}
            />
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
          <View style={{width: '100%'}}>
            {currentConversation.my_permission !== 0 && (
              <TouchableOpacity
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  backgroundColor: '#f0f0f0',
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                }}
                onPress={() => {
                  navigation.navigate('MemberApproval');
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    {color: '#000', fontSize: 18, fontWeight: 700},
                  ]}>
                  Duyệt thành viên
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                width: '100%',
                flexDirection: 'row',
                backgroundColor: '#f0f0f0',
                padding: 10,
                borderRadius: 8,
                marginTop: 10,
              }}
              onPress={() => {
                if (currentConversation.is_join_with_link === 0) {
                  Alert.alert(
                    'Chưa kích hoạt tham gia bằng liên kết',
                    'Bạn có muốn kích hoạt tính năng tham gia bằng liên kết không?',
                    [
                      {
                        text: 'Có',
                        onPress: async () => {
                          const data = await acceptJoinByLink(
                            currentConversation._id,
                            accessTokens,
                          );
                          console.log(data);
                          setCurrentConversation({
                            ...currentConversation,
                            is_join_with_link: 1,
                            link_join: data.data.link_join,
                          });
                          navigation.navigate('JoinByLink');
                        },
                      },
                      {
                        text: 'Không',
                        style: 'cancel',
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  navigation.navigate('JoinByLink');
                }
              }}>
              <Text
                style={[
                  styles.buttonText,
                  {color: '#000', fontSize: 18, fontWeight: 700},
                ]}>
                Link tham gia nhóm
              </Text>
            </TouchableOpacity>
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
            {currentConversation.my_permission === 2 && (
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
                  handleDisbandConversation();
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    {color: 'red', fontSize: 18, fontWeight: 700},
                  ]}>
                  Giải tán nhóm
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {currentConversation.type === 2 && (
          <View style={{width: '100%'}}>
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
          </View>
        )}
      </View>
    </ScrollView>
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
