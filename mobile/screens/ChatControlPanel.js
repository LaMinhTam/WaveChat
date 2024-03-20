import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  BACKGROUND_COLOR,
  MAIN_COLOR,
  PRIMARY_TEXT_COLOR,
} from '../styles/styles';
import {useSocket} from '../contexts/SocketProvider';

const ChatControlPanel = ({navigation}) => {
  const {currentConversation, messages} = useSocket();

  const mediaMessage = messages.filter(
    message => message.type === 2 || message.type === 3,
  );
  const viewUserPage = () => {
    const userIds = currentConversation.members;
    navigation.navigate('UserInfomation', {userIds});
  };

  const getLinkJoin = () => {};

  const renderImageItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image
        source={{
          uri: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${currentConversation._id}/${item.media[0]}`,
        }}
        style={styles.image}
      />
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
          <TouchableOpacity style={styles.button} onPress={() => getLinkJoin()}>
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
      </View>
      <TouchableOpacity
        style={styles.imageSection}
        onPress={() => navigation.navigate('ImagesScreen', {mediaMessage})}>
        <Text style={styles.sectionName}>Ảnh</Text>
        <FlatList
          data={mediaMessage.slice(0, 3)}
          keyExtractor={item => item._id}
          renderItem={renderImageItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={renderRightArrow}
          contentContainerStyle={styles.imageList}
        />
      </TouchableOpacity>
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
    marginRight: 10,
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
});

export default ChatControlPanel;
