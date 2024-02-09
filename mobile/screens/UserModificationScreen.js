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
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useAuth} from '../contexts/auth-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {updateProfile} from '../apis/user';
import {set} from 'firebase/database';

const UserModificationScreen = ({navigation}) => {
  const {userInfo, setUserInfo, accessTokens, setAccessTokens} = useAuth();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [checked, setChecked] = useState(userInfo.gender === 1 ? 'Nam' : 'Nữ');
  const [userName, setUserName] = useState(userInfo.full_name);
  const [birthday, setBirthday] = useState(userInfo.birthday);

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
    setBirthday(dob);
    hideDatePicker();
  };

  const handleGenderChange = value => {
    setChecked(value);
  };

  const handleInputChange = value => {
    setUserName(value);
  };

  const handleUpdateProfile = async () => {
    setUserInfo({...userInfo, full_name: userName, gender: checked === 'Nam' ? 1 : 0, birthday: birthday});
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
        <View style={styles.inforContain}>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
            />
            <TouchableOpacity style={styles.row} onPress={handleInputChange}>
              <EntypoIcon
                name="pencil"
                size={20}
                style={{color: '#000'}}></EntypoIcon>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={showDatePicker} style={styles.row}>
              <Text style={styles.name}> {birthday}</Text>
              <EntypoIcon
                name="pencil"
                size={20}
                style={{color: '#000'}}></EntypoIcon>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View>
            <RadioButton.Group onValueChange={handleGenderChange}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <RadioButton.Item
                  label="Nam"
                  value="Nam"
                  labelStyle={{fontSize: 20}}
                  status={checked === 'Nam' ? 'checked' : 'unchecked'}
                  color="#1dc071"
                  position="leading"
                />
                <RadioButton.Item
                  label="Nữ"
                  value="Nữ"
                  status={checked === 'Nữ' ? 'checked' : 'unchecked'}
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
        <TouchableOpacity
          style={styles.submit}
          onPress={handleUpdateProfile}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: '500',
              textTransform: 'uppercase',
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
    backgroundColor: '#eef0f1',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  inforContain: {
    flex: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
  },

  // Input
  input: {
    fontSize: 20,
    color: '#000',
  },
  // Save button
  btnSave: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    backgroundColor: '#1dc071',
    width: '90%',
    alignItems: 'center',
    padding: '2%',
    borderRadius: 80,
    marginHorizontal: '5%',
  },
});

export default UserModificationScreen;
