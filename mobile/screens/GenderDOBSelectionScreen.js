import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useUserData} from '../contexts/auth-context';
import {updateProfile} from '../apis/user';

const GenderDOBSelectionScreen = ({navigation, route}) => {
  const [selectedGender, setSelectedGender] = useState(0);
  const [selectedDOB, setSelectedDOB] = useState(new Date());
  const {userInfo, setUserInfo, storeAccessToken} = useUserData();
  const {accessToken} = route.params;

  const handleGenderSelection = gender => {
    setUserInfo({
      ...userInfo,
      gender: selectedGender,
      updated_at: new Date().getTime(),
    });
    setSelectedGender(gender);
  };

  const handleDateChange = date => {
    setUserInfo({
      ...userInfo,
      birthday:
        selectedDOB.getDate() +
        '/' +
        (selectedDOB.getMonth() + 1) +
        '/' +
        selectedDOB.getFullYear(),
      updated_at: new Date().getTime(),
    });
    setSelectedDOB(date);
  };

  const navigateToNextScreen = async () => {
    try {
      const {_id, ...userInfoWithoutId} = userInfo;
      await updateProfile(userInfoWithoutId, accessToken);
      storeAccessToken('accessToken', accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  const renderGenderButton = (gender, label) => (
    <TouchableOpacity
      style={[
        styles.genderButton,
        selectedGender === gender && styles.selectedGenderBG,
      ]}
      onPress={() => handleGenderSelection(gender)}>
      <Text
        style={[
          styles.genderButtonText,
          selectedGender === gender && styles.selectedGenderColor,
          selectedGender !== gender && styles.unSelectedGenderColor,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{width: '100%'}}>
        <Text style={styles.title}>Chọn giới tính</Text>
        <View style={styles.genderContainer}>
          {renderGenderButton(0, 'Nam')}
          {renderGenderButton(1, 'Nữ')}
        </View>
      </View>

      <View style={{width: '100%'}}>
        <Text style={styles.title}>Chọn ngày sinh</Text>

        <View>
          <DatePicker
            style={{alignSelf: 'center'}}
            date={selectedDOB}
            onDateChange={handleDateChange}
            androidVariant="nativeAndroid"
            mode="date"
            locale="vi"
            textColor="#1DC071"
            maximumDate={new Date()}
          />
          <Text style={styles.selectedDOBText}>
            Ngày sinh: {selectedDOB.toLocaleDateString('en-US')}
          </Text>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={navigateToNextScreen}>
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1a1a1a',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  genderButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1DC071',
  },
  selectedGenderBG: {
    backgroundColor: '#1DC071',
  },
  selectedGenderColor: {
    color: '#fff',
  },
  unSelectedGenderColor: {
    color: '#1DC071',
  },
  genderButtonText: {
    fontWeight: 'bold',
  },
  selectedDOBText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#1a1a1a',
  },
  nextButton: {
    backgroundColor: '#1DC071',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GenderDOBSelectionScreen;
