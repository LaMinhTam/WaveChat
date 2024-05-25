import React, {useState} from 'react';
import {View, Image, TouchableOpacity, FlatList} from 'react-native';
import MediaViewModal from './MediaViewModal';

const MessageImage = ({item}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePress = uri => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const singleImageStyle = {
    width: '100%',
    aspectRatio: 1,
  };

  const multipleImageStyle = {
    width: 100,
    height: 100,
    margin: 5,
  };

  const renderImageItem = ({item: image, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(`${image.split(';')[3]}`);
          return handleImagePress(image.split(';')[3]);
        }}>
        <Image
          source={{
            uri: `${image.split(';')[3]}`,
          }}
          style={
            item.media.length === 1 ? singleImageStyle : multipleImageStyle
          }
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={item.media}
        renderItem={renderImageItem}
        keyExtractor={(image, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={{
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
      />
      <MediaViewModal
        visible={modalVisible}
        item={selectedImage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default MessageImage;
