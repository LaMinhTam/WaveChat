import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

const ImagesScreen = ({navigate, route}) => {
  const {mediaMessage} = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const groupedMediaMessages = mediaMessage.reduce((acc, message) => {
    const date = new Date(message.created_at);
    const dayKey = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(message);
    return acc;
  }, {});

  const handleImagePress = uri => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  };

  return (
    <View style={styles.container}>
      {groupedMediaMessages &&
        Object.keys(groupedMediaMessages).map((dayKey, index) => (
          <View key={index}>
            <Text style={styles.tag}>
              {formatDate(groupedMediaMessages[dayKey][0].created_at)}
            </Text>
            <View style={styles.imageContainer}>
              {groupedMediaMessages[dayKey].map((message, messageIndex) => (
                <TouchableOpacity
                  key={messageIndex}
                  onPress={() =>
                    handleImagePress(
                      `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${message.conversation_id}/${message.media[0]}`,
                    )
                  }>
                  <Image
                    source={{
                      uri: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${message.conversation_id}/${message.media[0]}`,
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
            <Text style={{color: 'white', fontSize: 18}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
  tag: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  goBackButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default ImagesScreen;
