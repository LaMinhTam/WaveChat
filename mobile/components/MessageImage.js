import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import MediaViewModal from './MediaViewModal';

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
            `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${item.conversation_id}/${item.media[0]}`,
          )
        }>
        <Image
          source={{
            uri: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${item.conversation_id}/${item.media[0]}`,
          }}
          style={{width: '100%', aspectRatio: 1}}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <MediaViewModal
        visible={modalVisible}
        item={item}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};
export default MessageImage;
