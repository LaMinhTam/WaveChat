import React, {useState} from 'react';
import {useUserData} from '../contexts/auth-context';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {findUserByPhoneNumber} from '../apis/user';
import {BACKGROUND_COLOR, MAIN_COLOR} from '../styles/styles';
import {RenderView} from '../components/RenderView';
import {QRCodeScanner} from '../components/QRCodeScanner';

const SearchScreen = ({navigation}) => {
  const {accessTokens} = useUserData();
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  async function fetchUser(phoneNumber) {
    if (phoneNumber.length === 10) {
      const res = await findUserByPhoneNumber(
        phoneNumber,
        accessTokens.accessToken,
      );
      if (res.status === 200) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => {
            setPhoneNumber('');
            navigation.goBack();
          }}>
          <Icon name="arrow-left" size={20} color="#fff"></Icon>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <TextInput
              autoFocus={true}
              placeholder="Tìm kiếm"
              placeholderTextColor="#ccc"
              keyboardType="phone-pad"
              style={{color: '#000', fontSize: 16}}
              selectionColor="#50fa7b"
              value={phoneNumber}
              onChangeText={text => {
                setPhoneNumber(text);
                if (text.length === 10) {
                  fetchUser(text);
                } else {
                  setUser(null);
                }
              }}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.touchAble} onPress={()=>{navigation.navigate('QRScreen')}}>
          <Icon name="qrcode-scan" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <RenderView user={user} phoneNumber={phoneNumber} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    height: '100%',
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    backgroundColor: MAIN_COLOR,
    display: 'flex',
    flexDirection: 'row',
    padding: '2%',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    margin: 15,
  },
  touchAble: {
    padding: '2%',
    color: '#fff',
  },
});

export default SearchScreen;
