import React from 'react';
import {View, Modal, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MediaViewModal = ({visible, item, onClose}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Image
          source={{
            uri: item.media[0],
          }}
          style={styles.modalImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.goBackButton} onPress={onClose}>
          <Ionicons name="arrow-back" style={{color: 'white', fontSize: 30}} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  goBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default MediaViewModal;
