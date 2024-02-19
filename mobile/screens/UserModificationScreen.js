import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useAuth} from '../contexts/auth-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {updateProfile} from '../apis/user';
import {BACKGROUND_COLOR, MAIN_COLOR, SECOND_COLOR} from '../styles/styles';

const UserModificationScreen = ({navigation}) => {
  const {userInfo, setUserInfo, accessTokens} = useAuth();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [checked, setChecked] = useState(userInfo.gender === 1 ? true : false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dob = `${day}/${month}/${year}`;
    setUserInfo({...userInfo, birthday: dob});
    hideDatePicker();
  };

  const handleGenderChange = value => {
    setChecked(value === 'Nam' ? true : false);
    setUserInfo({...userInfo, gender: value === 'Nam' ? 1 : 0});
  };

  const handleInputChange = value => {
    setUserInfo({...userInfo, full_name: value});
  };

  const handleUpdateProfile = async () => {
    const data = await updateProfile(userInfo, accessTokens.accessToken);
    console.log(userInfo);
    if (data.status === 200) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{uri: userInfo.avatar}} style={styles.avatar} />
        <View style={{flex: 1}}>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={userInfo.full_name}
              onChangeText={handleInputChange}
            />
          </View>
          <View>
            <TouchableOpacity onPress={showDatePicker} style={styles.row}>
              <Text style={styles.name}> {userInfo.birthday}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View>
            <RadioButton.Group onValueChange={handleGenderChange} >
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <RadioButton.Item
                  label="Nam"
                  value="Nam"
                  labelStyle={{fontSize: 20}}
                  status={checked === true ? 'checked' : 'unchecked'}
                  color="#1dc071"
                  position="leading"
                />
                <RadioButton.Item
                  label="Nữ"
                  value="Nữ"
                  status={checked === false ? 'checked' : 'unchecked'}
                  labelStyle={{fontSize: 20}}
                  color="#1dc071"
                  position="leading"
                />
              </View>
            </RadioButton.Group>
          </View>
        </View>
      </View>
      <View style={styles.btnSave}>
        <TouchableOpacity style={styles.submit} onPress={handleUpdateProfile}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: '500',
            }}>
            Lưu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SECOND_COLOR,
    paddingHorizontal: 20,
  },
  avatar: {
    alignSelf: 'flex-start',
    width: 70,
    height: 70,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#fff',
    margin: '2%',
  },
  name: {
    fontSize: 20,
    color: '#000',
    paddingVertical: 9,
  },
  touchAble: {
    padding: 10,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF',
  },
  input: {
    fontSize: 20,
    color: '#000',
  },
  btnSave: {
    flexDirection: 'row',
  },
  submit: {
    backgroundColor: MAIN_COLOR,
    width: '90%',
    alignItems: 'center',
    padding: '2%',
    borderRadius: 80,
  },
});

export default UserModificationScreen;
