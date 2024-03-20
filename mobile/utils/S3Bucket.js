import {RNS3} from 'react-native-aws3';
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET,
} from '@env';

const accessKey = AWS_ACCESS_KEY_ID;
const secretKey = AWS_SECRET_ACCESS_KEY;
const region = AWS_REGION;
const bucket = AWS_BUCKET;

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

export const uploadImageToS3 = async (image, keyPrefix) => {
  const file = {
    uri: image.path,
    name: image.name,
    type: image.mime,
  };

  const config = {
    keyPrefix: keyPrefix,
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
