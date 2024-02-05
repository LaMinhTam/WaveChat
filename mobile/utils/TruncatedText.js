import {View, Text} from 'react-native';
import React, {useCallback, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PRIMARY_TEXT_COLOR} from '../styles/styles';

export const TruncatedText = ({text}) => {
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length > 4);
  }, []);

  return (
    <View>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 4}
        style={{lineHeight: 21, color: PRIMARY_TEXT_COLOR}}>
        {text}
      </Text>
      {lengthMore && (
        <TouchableOpacity onPress={toggleNumberOfLines}>
          <Text style={{color: 'blue', marginTop: 5}}>
            {textShown ? 'Rút gọn...' : 'Xem thêm'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
