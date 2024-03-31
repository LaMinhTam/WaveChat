import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {CONVERSATION_TYPE, USER_INFO} from '../apis/constants';
import {TruncatedText} from '../utils/TruncatedText';
import {formatTimeLastActivity} from '../utils/format-time-message.util';
import AvatarUser from './AvatarUser';
import MessageFile from './MessageFile';
import MessageImage from './MessageImage';
import MessageVideo from './MessageVideo';
import Fontisto from 'react-native-vector-icons/Fontisto';
const Message = ({item, userInfo}) => {
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuOptions, setContextMenuOptions] = useState([]);
  const isCurrentUser = item.user._id === userInfo._id;

  const renderContent = () => {
    switch (item.type) {
      case 1:
        return <TruncatedText text={item.message} />;
      case 2:
        return <MessageImage item={item} />;
      case 3:
        return <MessageVideo item={item} />;
      case 5:
        return <MessageFile item={item} />;
      default:
        return null;
    }
  };

  const handleContextMenu = () => {
    setContextMenuOptions([]);
    if (item.type !== 1) {
      setContextMenuOptions(prevState => [...prevState, 'Lưu file']);
    }
    if (isCurrentUser) {
      setContextMenuOptions(prevState => [...prevState, 'Thu hồi']);
    }
    setContextMenuVisible(true);
  };

  const handleOptionSelect = option => {
    setContextMenuVisible(false);
    if (option === 'Lưu file') {
      console.log('Lưu file');
    } else if (option === 'Thu hồi') {
      console.log('Thu hồi');
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        marginVertical: 5,
      }}>
      {!isCurrentUser && (
        <AvatarUser
          avatarUrl={item.user.avatar}
          style={USER_INFO.AVATAR_USER_STYLES_DEFAULT}
          type={CONVERSATION_TYPE.PERSONAL}
        />
      )}

      <TouchableOpacity
        onLongPress={handleContextMenu}
        style={{
          maxWidth: '60%',
          backgroundColor: isCurrentUser ? '#d6ffeb' : '#F0F0F0',
          padding: 10,
          marginHorizontal: 10,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}>
        {renderContent()}

        <Text style={{color: '#777', fontSize: 12, marginTop: 5}}>
          {formatTimeLastActivity(item.created_at)}
        </Text>

        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            [isCurrentUser ? 'left' : 'right']: -40,
            backgroundColor: '#fff',
            padding: 10,
            overflow: 'hidden',
            borderRadius: 100,
          }}>
          <Fontisto
            name="like"
            style={{color: true ? 'gray' : 'gray'}}></Fontisto>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* {isCurrentUser && (
        <AvatarUser
          avatarUrl={item.user.avatar}
          style={USER_INFO.AVATAR_USER_STYLES_DEFAULT}
          type={CONVERSATION_TYPE.PERSONAL}
        />
      )} */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isContextMenuVisible}
        onRequestClose={() => setContextMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setContextMenuVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {contextMenuOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleOptionSelect(option)}>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    minWidth: 150,
  },
  optionButton: {
    padding: 10,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Message;
