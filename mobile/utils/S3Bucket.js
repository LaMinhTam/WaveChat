import {RNS3} from 'react-native-aws3';

const accessKey = 'AKIAZQ3DS6OMCMIHTFUR';
const secretKey = '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';
const region = 'ap-southeast-1';
const bucket = 'wavechat';

export const sendImageMessage = async (image, conversationID) => {
  const name = image.path.split('/').pop();

  const file = {
    uri: image.path,
    name: name,
    type: image.mime,
  };

  const config = {
    keyPrefix: `conversation/${conversationID}/`,
    bucket: bucket,
    region: region,
    accessKey: accessKey,
    secretKey: secretKey,
  };

  try {
    const response = await RNS3.put(file, config);
    return response.body.postResponse.location;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadFileToS3 = async (uploadFile, conversationID) => {
  const file = {
    uri: uploadFile.fileCopyUri,
    name: uploadFile.name,
    type: uploadFile.type,
  };

  const config = {
    keyPrefix: `conversation/${conversationID}/`,
    bucket: bucket,
    region: region,
    accessKey: accessKey,
    secretKey: secretKey,
  };

  try {
    const response = await RNS3.put(file, config);
    return response.body.postResponse.location;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
