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

export const sendImageMessage = async (image, conversationID, fileName) => {
  const file = {
    uri: image.path,
    name: fileName,
    type: image.mime,
  };

  const config = {
    keyPrefix: `conversation/${conversationID}/images/`,
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

export const uploadFileToS3 = async (uploadFile, conversationID, fileName) => {
  const file = {
    uri: uploadFile.fileCopyUri,
    name: fileName,
    type: uploadFile.type,
  };

  const config = {
    keyPrefix: `conversation/${conversationID}/files/`,
    bucket: bucket,
    region: region,
    accessKey: accessKey,
    secretKey: secretKey,
  };
  console.log(bucket, region, accessKey, secretKey);

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
  console.log(bucket, region, accessKey, secretKey);

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
