import React, {useEffect, useState} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {removeMember, updatePermission} from '../apis/conversation';

const MemberOptionsModal = ({
  visible,
  onClose,
  selectedMember,
  setCurrentConversation,
  currentConversation,
  accessTokens,
  navigation,
  setConversations,
  userId,
}) => {
  const [contextMenuOptions, setContextMenuOptions] = useState([]);

  useEffect(() => {
    if (currentConversation.my_permission == 2) {
      setContextMenuOptions([
        'Xóa khỏi nhóm',
        'Thêm phó nhóm',
        'Chuyển quyền trưởng nhóm',
      ]);
    } else if (currentConversation.my_permission == 1) {
      setContextMenuOptions(['Xóa khỏi nhóm']);
    } else if (currentConversation.my_permission == 0) {
      setContextMenuOptions(['Xem trang cá nhân']);
    }
  }, [selectedMember]);

  // if (item.type != 14) {
  //   setContextMenuOptions(prevState => [...prevState, 'Chuyển tiếp']);
  //   if (isCurrentUser) {
  //     setContextMenuOptions(prevState => [...prevState, 'Thu hồi']);
  //   }
  // }

  const handleContextMenuSelect = option => {
    if (option === 'Xóa khỏi nhóm') {
      handleRemoveMember();
    } else if (option === 'Thêm phó nhóm') {
      handleGrantDeputy();
    } else if (option === 'Chuyển quyền trưởng nhóm') {
      handleGrantAdmin();
    } else if (option === 'Xem trang cá nhân') {
      const userIds = selectedMember.user_id;
      navigation.navigate('UserInfomation', {userIds: [userIds]});
    }
    onClose();
  };

  const handleRemoveMember = async () => {
    const data = await removeMember(
      currentConversation._id,
      selectedMember.user_id,
      accessTokens,
    );
    if (data.status === 200) {
      setCurrentConversation({
        ...currentConversation,
        virtual_members: currentConversation.virtual_members.filter(
          member => member._id !== selectedMember._id,
        ),
      });
    } else {
      Alert.alert('Lỗi', data.message);
    }
  };

  const handleGrantDeputy = async () => {
    const data = await updatePermission(
      currentConversation._id,
      selectedMember.user_id,
      1,
      accessTokens,
    );
    setCurrentConversation({
      ...currentConversation,
      virtual_members: currentConversation.virtual_members.map(member =>
        member._id === selectedMember._id ? {...member, permission: 1} : member,
      ),
    });
    console.log(data);
  };

  const handleGrantAdmin = async () => {
    const data = await updatePermission(
      currentConversation._id,
      selectedMember.user_id,
      2,
      accessTokens,
    );

    setCurrentConversation({
      ...currentConversation,
      my_permission: 0,
      owner_id: selectedMember.user_id,
      virtual_members: currentConversation.virtual_members.map(member =>
        member._id === selectedMember._id
          ? {...member, permission: 2}
          : member.user_id === userId
          ? {...member, permission: 0}
          : member,
      ),
    });

    setConversations(prevState =>
      prevState.map(conversation =>
        conversation._id === currentConversation._id
          ? {...conversation, owner_id: selectedMember.user_id}
          : conversation,
      ),
    );
    // console.log(data);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {contextMenuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleContextMenuSelect(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            {/* <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleRemoveMember()}>
              <Text style={styles.optionText}>Xóa khỏi nhóm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={onAddAsCoLeader}>
              <Text style={styles.optionText}>Thêm phó nhóm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={onTransferOwnership}>
              <Text style={styles.optionText}>Chuyển quyền trưởng nhóm</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    padding: 20,
    borderRadius: 10,
    minWidth: 200,
  },
  optionButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default MemberOptionsModal;
