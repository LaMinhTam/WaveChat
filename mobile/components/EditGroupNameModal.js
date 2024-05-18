import React, {useState} from 'react';
import {Modal, View, Text, TextInput, Button, StyleSheet} from 'react-native';

const EditGroupNameModal = ({visible, onClose, onSave}) => {
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    onSave(newName);
    setNewName('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Đổi tên nhóm</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={text => setNewName(text)}
            placeholder="Nhập tên mới cho nhóm"
            placeholderTextColor={'#ccc'}
          />
          <View style={styles.buttonContainer}>
            <Button title="Huỷ" onPress={onClose} />
            <Button title="Lưu" onPress={handleSave} />
          </View>
        </View>
      </View>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EditGroupNameModal;
