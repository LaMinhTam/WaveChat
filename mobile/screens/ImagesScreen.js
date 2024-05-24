import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';

const ImagesScreen = ({navigate, route}) => {
  const {mediaMessageForSection} = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const mediaMessage = mediaMessageForSection.flatMap(message => {
    return message.media.map(mediaItem => {
      return {
        ...message,
        media: mediaItem,
      };
    });
  });

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
    return `${day} tháng ${month}`;
  };

  return (
    <ScrollView style={styles.container}>
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
                  onPress={() => {
                    if (message.type === 2) {
                      handleImagePress(
                        `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${
                          message.conversation_id
                        }/images/${message.media.split(';')[1]}`,
                      );
                    }
                  }}>
                  {message.type === 2 && (
                    <Image
                      source={{
                        uri: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${
                          message.conversation_id
                        }/images/${message.media.split(';')[1]}`,
                      }}
                      style={styles.image}
                    />
                  )}
                  {message.type === 3 && (
                    <VideoPlayer
                      style={styles.image}
                      video={{
                        uri: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${
                          message.conversation_id
                        }/files/${message.media.split(';')[1]}`,
                      }}></VideoPlayer>
                  )}
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
    </ScrollView>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  tag: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
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
