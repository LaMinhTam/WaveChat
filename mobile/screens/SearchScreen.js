import React, {useState, useEffect} from 'react';
import {useAuth} from '../contexts/auth-context';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFriends } from '../apis/user';

const SearchScreen = ({navigation}) => {
  const {userInfo, setUserInfo, accessTokens, setAccessTokens} = useAuth();
  const [query, setQuery] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  
  const handleInputChange = (value) => {
    setPhoneNumber(value);
  }
  
  useEffect(() => {
    console.log(phoneNumber);
  }, [phoneNumber]);
  
  const handleSearch = () => {
    const findFriend = getFriends(accessTokens.accessToken);
    console.log(findFriend); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrow-left" size={24} color="#fff"></Icon>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#000',
              borderRadius: 15,
            }}>
            <Icon
              name="search"
              size={20}
              color="#ccc"
              style={{paddingHorizontal: 10}}
            />
            <TextInput
              placeholder="Tìm kiếm"
              placeholderTextColor="#f3e7fd"
              keyboardType='phone-pad'
              style={{color: 'white', fontSize: 16}}
              // value={phoneNumber}
              onChangeText={handleInputChange}
            />

          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{phoneNumber}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: '100%',
  },
  header: {
    backgroundColor: '#1dc071',
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
  },
  touchAble: {
    padding: 10,
    marginRight: 10,
    color: '#fff',
  },
});

export default SearchScreen;
