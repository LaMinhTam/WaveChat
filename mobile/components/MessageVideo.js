import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import VideoPlayer from 'react-native-video-player';
import MediaViewModal from './MediaViewModal';

const MessageVideo = ({item}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMediaPress = uri => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  return (
    <TouchableOpacity>
      <VideoPlayer
        fullScreenOnLongPress
        disableFullscreen={false}
        video={{
          // uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          uri: `${item.media[0].split(';')[3]}`,
        }}></VideoPlayer>
      {/* <MediaViewModal
        visible={modalVisible}
        item={`https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${
          item.conversation_id
        }/files/${item.media[0].split(';')[1]}`}
        onClose={() => setModalVisible(false)}
      /> */}
    </TouchableOpacity>
  );
};

export default MessageVideo;
