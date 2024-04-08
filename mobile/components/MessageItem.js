import {Text} from 'react-native';
import Message from './Message';
import React, {useState} from 'react';

const MessageItem = ({
  item,
  searchKeyword,
  userInfo,
  handleOptionSelect,
  handleReactToMessage,
}) => {
  const parts = searchKeyword
    ? item.message.split(new RegExp(`(${searchKeyword})`, 'gi'))
    : [item.message];

  const [isContextMenuVisible, setContextMenuVisible] = useState(false);

  const handleContextMenuSelect = (option, item) => {
    handleOptionSelect(option, item);
    setContextMenuVisible(false);
  };
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
      handleContextMenuSelect={handleContextMenuSelect}
      isContextMenuVisible={isContextMenuVisible}
      setContextMenuVisible={setContextMenuVisible}
      handleReactToMessage={handleReactToMessage}
    />
  );
};

export default React.memo(MessageItem);
