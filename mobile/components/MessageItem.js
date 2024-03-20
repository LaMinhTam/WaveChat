import {Text} from 'react-native';
import Message from './Message';
import React from 'react';

const MessageItem = ({item, searchKeyword, userInfo}) => {
  const parts = item.message.split(new RegExp(`(${searchKeyword})`, 'gi'));
  return (
    <Message
      item={{
        ...item,
        message: parts.map((part, index) =>
          part.toLowerCase() === searchKeyword.toLowerCase() ? (
            <Text key={index} style={{backgroundColor: 'yellow'}}>
              {part}
            </Text>
          ) : (
            part
          ),
        ),
      }}
      userInfo={userInfo}
    />
  );
};

export default React.memo(MessageItem);
