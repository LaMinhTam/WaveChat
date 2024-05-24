import React from 'react';
import {View, Modal, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';

const MediaViewModal = ({visible, item, onClose}) => {
  const handleDowloadImage = async () => {
    const destinationPath = `${RNFS.DownloadDirectoryPath}/wavechat`;
    const filePath = `${destinationPath}/${item.split('/').pop()}`;
    console.log(item);
    await RNFS.mkdir(destinationPath);
    const res = await RNFS.downloadFile({
      fromUrl: item,
      toFile: filePath,
    }).promise;
    if (res.statusCode === 200) {
      console.log('Download Complete', `File saved at ${destinationPath}`);
    } else {
      console.log('Download Failed', 'Failed to download file');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Image
          source={{
            uri: item,
          }}
          style={styles.modalImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.goBackButton} onPress={onClose}>
          <Ionicons name="arrow-back" style={{color: 'white', fontSize: 30}} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dowloadButton}
          onPress={handleDowloadImage}>
          <Ionicons name="download" style={{color: 'white', fontSize: 30}} />
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
  dowloadButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default MediaViewModal;
