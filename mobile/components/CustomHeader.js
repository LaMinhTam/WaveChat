import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
      <FontAwesomeIcon
        name="search"
        size={20}
        color="#fff"
        style={{paddingHorizontal: '5%'}}
      />
    </TouchableOpacity>
  </View>
);

export const HeaderRight = ({navigation}) => {
  return (
    <View style={{flexDirection: 'row', gap: 10, padding: 10}}>
      <TouchableOpacity>
        <MaterialIcon name="qrcode-scan" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('GroupCreate');
        }}>
        <MaterialIcon name="account-multiple-plus" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
