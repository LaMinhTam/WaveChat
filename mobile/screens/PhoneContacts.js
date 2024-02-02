import {View, Text, StyleSheet, PermissionsAndroid, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BACKGROUND_COLOR} from '../styles/styles';
import Contacts from 'react-native-contacts';
import {getProfile} from '../apis/user';
import {useAuth} from '../contexts/auth-context';

const PhoneContacts = () => {
  const [contacts, setContacts] = useState([]);
  const {accessTokens} = useAuth();

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
        var array = [];
        contacts.forEach(contact => {
          var contact = {
            name: contact.displayName,
            isStarred: contact.isStarred,
            phone: [contact.phoneNumbers[0]],
          };
          array.push(contact);
        });
        setContacts(array);
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

    contacts.forEach(contact => {
      contact.phone.forEach(async phone => {
        console.log('doing');
        //lack of api so this is waiting to implement
        // get user profile by the phone number, then if exist user with that phone number, add to an array
        // with the structure
        // { nameInContact: String
        //   nameInDB: String
        //   phone: phone
        //   avtar: String
        //   isFriend: Boolean
        // }
        // and store friend in a userInfo, then compare here if is friend already, then isFriend is true else false
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>PhoneContacts</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
});
export default PhoneContacts;
