import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const HeaderTitle = ({navigation}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SearchScreen');
      }}
      style={{width: '100%'}}>
      <Text style={{color: 'white', fontSize: 16}}>Tìm kiếm</Text>
    </TouchableOpacity>
  </View>
);

export const HeaderLeft = ({navigation}) => (
  <View>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SearchScreen');
      }}>
      <Icon
        name="search"
        size={26}
        color="#fff"
        style={{paddingHorizontal: '5%'}}
      />
    </TouchableOpacity>
  </View>
);

export const HeaderRight = () => (
  <View style={{flexDirection: 'row', gap: 10, padding: 10}}>
    <TouchableOpacity>
      <Icon name="qrcode" size={30} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => {}}>
      <Icon name="plus" size={30} color="#fff" />
    </TouchableOpacity>
  </View>
);
