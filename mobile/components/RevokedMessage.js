import {View, Text} from 'react-native';
import React from 'react';

const RevokedMessage = ({item}) => {
  return (
    <View>
      <Text style={{color: '#8e8e8e', fontStyle: 'italic'}}>
        Tin nhắn đã được thu hồi
      </Text>
    </View>
  );
};

export default RevokedMessage;
