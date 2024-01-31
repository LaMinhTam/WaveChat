import {StyleSheet} from 'react-native';

const commonStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainColor: {
    color: '#1DC071',
  },
  secondColor: {
    color: SECOND_COLOR,
  },
});

export default commonStyle;
export const MAIN_COLOR = '#1dc071';
export const SECOND_COLOR = true ? '#fff' : '#1a1a1a';
