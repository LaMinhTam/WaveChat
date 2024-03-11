import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image, Linking} from 'react-native';
import RNFS from 'react-native-fs';
import {PRIMARY_TEXT_COLOR, SECONDARY_TEXT_COLOR} from '../styles/styles';

const getFileIcon = fileName => {
  const extensionIndex = fileName.lastIndexOf('.');
  if (extensionIndex !== -1) {
    const extension = fileName.substring(extensionIndex + 1).toLowerCase();
    switch (extension) {
      case 'pdf':
        return require('../assets/pdf.png');
      case 'doc':
      case 'docx':
        return require('../assets/txt.png');
      case 'xls':
      case 'xlsx':
        return require('../assets/excel.png');
      // Add cases for other file types as needed
      default:
        return require('../assets/excel.png');
    }
  }
  return require('../assets/excel.png');
};

const formatFileSize = size => {
  const KB = 1024;
  const MB = KB * KB;

  if (size < MB) {
    const sizeKB = (size / KB).toFixed(2);
    return `${sizeKB} KB`;
  } else {
    const sizeMB = (size / MB).toFixed(2);
    return `${sizeMB} MB`;
  }
};

const truncateFileName = (fileName, maxLength) => {
  if (fileName.length <= maxLength) {
    return fileName;
  }
  const truncatedName = fileName.substring(0, maxLength - 3) + '...';
  const extensionIndex = fileName.lastIndexOf('.');
  if (extensionIndex !== -1) {
    const extension = fileName.substring(extensionIndex);
    return truncatedName + extension;
  }
  return truncatedName;
};

const MessageFile = ({item}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    const checkFileExists = async () => {
      const filePath = `${RNFS.DownloadDirectoryPath}/wavechat/${item.message}`;
      const fileExists = await RNFS.exists(filePath);

      if (fileExists) {
        const fileStat = await RNFS.stat(filePath);
        setFileInfo(fileStat);
        setDownloaded(fileExists);
      }
    };

    checkFileExists();
  }, [item.message]);

  const downloadFile = async () => {
    const destinationPath = `${RNFS.DownloadDirectoryPath}/wavechat`;
    const filePath = `${destinationPath}/${item.message}`;
    if (downloaded) {
      console.log(filePath);
    } else {
      await RNFS.mkdir(destinationPath);
      const res = await RNFS.downloadFile({
        fromUrl: `https://wavechat.s3.ap-southeast-1.amazonaws.com/conversation/${item.conversation_id}/${item.message}`,
        toFile: filePath,
      }).promise;
      setFileInfo({...fileInfo, size: res.bytesWritten});
      if (res.statusCode === 200) {
        console.log('Download Complete', `File saved at ${destinationPath}`);
        setDownloaded(true);
      } else {
        console.log('Download Failed', 'Failed to download file');
      }
    }
  };

  return (
    <TouchableOpacity onPress={() => downloadFile()}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={getFileIcon(item.message)}
          style={{width: 24, height: 24, marginRight: 10}}
        />
        <View>
          <View>
            <Text style={{color: PRIMARY_TEXT_COLOR}}>
              {truncateFileName(item.media[0], 20)}
            </Text>
            {downloaded && (
              <View>
                <Text style={{color: SECONDARY_TEXT_COLOR}}>
                  {formatFileSize(fileInfo?.size)}
                  {' \u2022 '}
                  {item.message.split('.').pop()}
                  Dã có trên máy
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MessageFile;
