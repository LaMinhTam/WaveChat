import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const getToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = messaging().getToken();
  return token;
};

export const addUserToFireStore = user => {
  const token = getToken();

  firestore()
    .collection('users')
    .doc(user._id)
    .set({
      name: user.full_name,
      phone: user.phone,
      password: user.password,
      avatar: 'https://source.unsplash.com/random',
      createdAt: user.created_at,
      fcmToken: [token],
    })
    .then(() => {
      console.log('User added!');
    });
};

export const addNewFCMToken = async user => {
  try {
    const token = await getToken();
    const userRef = firestore().collection('users').doc(user._id);
    userRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        if (!userData.fcmToken) {
          userRef.update({
            fcmToken: [token],
          });
        } else if (!userData.fcmToken.includes(token)) {
          console.log(
            'firestore.FieldValue.arrayUnion(token)',
            firestore.FieldValue.arrayUnion(token),
          );
          userRef.update({
            fcmToken: firestore.FieldValue.arrayUnion(token),
          });
        }
      } else {
        console.log('No such document!');
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const getTokenByIdFromFireStore = async id => {
  const userRef = firestore().collection('users').doc(id);
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    return doc.data().fcmToken;
  }
};
