import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  FlatList,
  Image,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {findUserByPhoneNumber, getProfile} from '../apis/user';
import {useUserData} from '../contexts/auth-context';
import {BACKGROUND_COLOR, PRIMARY_TEXT_COLOR} from '../styles/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FriendBox from '../components/FriendBox';

const PhoneContacts = () => {
  const [contacts, setContacts] = useState([]);
  const {accessTokens} = useUserData();
  const [contactFriends, setContactFriends] = useState([]);
  const {userInfo, friends, setFriends} = useUserData();

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Contacts permission granted');
        fetchContacts();
      } else {
        console.log('Contacts permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchContacts = async () => {
    try {
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (isGranted) {
        const contacts = await Contacts.getAll();
        const formattedContacts = contacts.flatMap(contact => {
          if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            return contact.phoneNumbers.map(phoneNumber => ({
              name: contact.displayName,
              phone: phoneNumber.number.replace(/ /g, ''),
            }));
          } else {
            return [];
          }
        });
        setContacts(formattedContacts);
      } else {
        requestContactsPermission();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      .then(isGranted => {
        if (isGranted) {
          fetchContacts();
        } else {
          requestContactsPermission();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    contacts.forEach(async contact => {
      if (userInfo.phone != contact.phone) {
        const data = await findUserByPhoneNumber(contact.phone, accessTokens);
        if (data.status === 200) {
          setContactFriends(prevFriends => [
            ...prevFriends,
            {...data.data.user, contact_name: contact.name},
          ]);
        }
      }
    });
  }, [contacts]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bạn bè từ danh bạ</Text>
      <FlatList
        data={contactFriends}
        keyExtractor={friend => friend._id}
        renderItem={({item}) =>
          FriendBox(item, friends, setFriends, accessTokens)
        }
        contentContainerStyle={styles.friendsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_TEXT_COLOR,
    marginBottom: 10,
  },
  friendsList: {
    flexGrow: 1,
  },
});

export default PhoneContacts;
