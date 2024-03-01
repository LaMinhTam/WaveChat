import React, {useState, useEffect, useRef} from 'react';
import {useAuth} from '../contexts/auth-context';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {findUserByPhoneNumber} from '../apis/user';
import {BACKGROUND_COLOR, MAIN_COLOR, SECOND_COLOR} from '../styles/styles';
import {RenderView} from '../screens/RenderView';
import {set} from 'firebase/database';

const SearchScreen = ({navigation}) => {
  const {accessTokens} = useAuth();
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
          <Icon name="arrow-left" size={24} color="#fff"></Icon>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 15,
              marginHorizontal: '2%',
            }}>
            <Icon
              name="search"
              size={20}
              color="#ccc"
              style={{paddingHorizontal: 10}}
            />
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
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.touchAble}>
          <Icon name="qrcode" size={34} color="#fff" />
        </TouchableOpacity>
      </View>
      <RenderView user={user} phoneNumber={phoneNumber} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
    height: '100%',
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    backgroundColor: MAIN_COLOR,
    display: 'flex',
    flexDirection: 'row',
    padding: '2%',
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
