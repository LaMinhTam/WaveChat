import React, {useEffect, useState} from 'react';
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
import RevokedMessage from './RevokedMessage';
import {reactToMessage} from '../apis/conversation';

const Message = ({
  item,
  userInfo,
  handleContextMenuSelect,
  isContextMenuVisible,
  setContextMenuVisible,
  handleReactToMessage,
}) => {
  const [contextMenuOptions, setContextMenuOptions] = useState([]);
  const isCurrentUser = item.user._id === userInfo._id;
  const [isReacted, setIsReacted] = useState(false);

  useEffect(() => {
    setIsReacted(
      item.reaction.some(reaction => reaction.user_id === userInfo._id),
    );
  }, [item]);

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
      case 14:
        return <RevokedMessage item={item} />;
      default:
        return null;
    }
  };

  const handleContextMenu = () => {
    setContextMenuOptions(['Xóa']);
    if (item.type != 14) {
      setContextMenuOptions(prevState => [...prevState, 'Chuyển tiếp']);
      if (isCurrentUser) {
        setContextMenuOptions(prevState => [...prevState, 'Thu hồi']);
      }
    }
    setContextMenuVisible(true);
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

        {item.type != 14 && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 0,
              [isCurrentUser ? 'left' : 'right']: -40,
              backgroundColor: '#fff',
              padding: 10,
              overflow: 'hidden',
              borderRadius: 100,
            }}
            onPress={() => {
              console.log('like');
              handleReactToMessage(item._id);
            }}>
            <Fontisto
              name="like"
              style={{color: isReacted ? 'yellow' : 'gray'}}></Fontisto>
          </TouchableOpacity>
        )}
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
                    onPress={() => handleContextMenuSelect(option, item)}>
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
