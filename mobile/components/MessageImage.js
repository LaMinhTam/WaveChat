import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MessageImage = ({item}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePress = uri => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          handleImagePress(
            `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${item.conversation_id}/${item.message}`,
          )
        }>
        <Image
          source={{
            uri: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${item.conversation_id}/${item.message}`,
          }}
          style={{width: '100%', aspectRatio: 1}}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Image
            source={{uri: selectedImage}}
            style={styles.modalImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => setModalVisible(false)}>
            <Ionicons
              name="arrow-back"
              style={{color: 'white', fontSize: 30}}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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

export default MessageImage;
