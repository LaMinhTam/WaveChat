import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {UserDataProvider} from './contexts/auth-context';
import {useUserData} from './contexts/auth-context';
import TabNavigator from './navigations/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {SocketProvider} from './contexts/SocketProvider';
import {PermissionsAndroid} from 'react-native';
const App = () => {
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, []);

  return (
    <Provider store={store}>
      <UserDataProvider>
        <NavigationContainer>
          <Main></Main>
        </NavigationContainer>
      </UserDataProvider>
    </Provider>
  );
};

const Main = () => {
  const {accessTokens} = useUserData();
  return (
    <>
      {accessTokens ? (
        <SocketProvider>
          <TabNavigator />
        </SocketProvider>
      ) : (
        <LoginStackNavigator />
      )}
    </>
  );
};
export default App;

// import React, {useEffect, useRef} from 'react';

// import {
//   Button,
//   KeyboardAvoidingView,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   View,
// } from 'react-native';

// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   mediaDevices,
// } from 'react-native-webrtc';
// import {useState} from 'react';

// import firestore from '@react-native-firebase/firestore';

// const App = () => {
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [webcamStarted, setWebcamStarted] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [channelId, setChannelId] = useState(null);
//   const [renderKey, setRenderKey] = useState(Date.now());
//   const pc = useRef();
//   const servers = {
//     iceServers: [
//       {
//         urls: [
//           'stun:stun1.l.google.com:19302',
//           'stun:stun2.l.google.com:19302',
//         ],
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };
//   useEffect(() => {
//     // Trigger re-render when renderKey changes
//   }, [renderKey]);
//   const startWebcam = async () => {
//     pc.current = new RTCPeerConnection(servers);
//     const local = await mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     // pc.current.addStream(local);
//     setLocalStream(local);
//     const remote = new MediaStream();
//     setRemoteStream(remote);

//     // Push tracks from local stream to peer connection
//     // local.getTracks().forEach(track => {
//     //   console.log(pc.current.getLocalStreams());
//     //   pc.current.getLocalStreams()[0].addTrack(track);
//     // });
//     local.getTracks().forEach(track => {
//       pc.current.addTrack(track, local);
//     });

//     // Pull tracks from remote stream, add to video stream
//     pc.current.ontrack = event => {
//       event.streams[0].getTracks().forEach(track => {
//         remote.addTrack(track);
//       });
//     };

//     pc.current.onaddstream = event => {
//       setRemoteStream(event.stream);
//     };

//     setWebcamStarted(true);
//   };

//   const startCall = async () => {
//     try {
//       const channelDoc = firestore().collection('channels').doc();
//       const offerCandidates = channelDoc.collection('offerCandidates');
//       const answerCandidates = channelDoc.collection('answerCandidates');
//       setChannelId(channelDoc.id);

//       pc.current.onicecandidate = async event => {
//         if (event.candidate) {
//           await offerCandidates.add(event.candidate.toJSON());
//         }
//       };

//       const offerDescription = await pc.current.createOffer();
//       await pc.current.setLocalDescription(offerDescription);

//       const offer = {
//         sdp: offerDescription.sdp,
//         type: offerDescription.type,
//       };

//       await channelDoc.set({offer});
//       setRenderKey(Date.now());
//       // Listen for remote answer
//       channelDoc.onSnapshot(snapshot => {
//         const data = snapshot.data();
//         if (!pc.current.currentRemoteDescription && data?.answer) {
//           const answerDescription = new RTCSessionDescription(data.answer);
//           pc.current.setRemoteDescription(answerDescription);
//         }
//       });

//       // When answered, add candidate to peer connection
//       answerCandidates.onSnapshot(snapshot => {
//         snapshot.docChanges().forEach(change => {
//           if (change.type === 'added') {
//             const data = change.doc.data();
//             pc.current.addIceCandidate(new RTCIceCandidate(data));
//           }
//         });
//       });
//     } catch (error) {
//       console.error('Error starting call:', error);
//     }
//   };

//   const joinCall = async () => {
//     try {
//       const channelDoc = firestore().collection('channels').doc(channelId);
//       const offerCandidates = channelDoc.collection('offerCandidates');
//       const answerCandidates = channelDoc.collection('answerCandidates');

//       pc.current.onicecandidate = async event => {
//         if (event.candidate) {
//           await answerCandidates.add(event.candidate.toJSON());
//         }
//       };

//       const channelDocument = await channelDoc.get();
//       const channelData = channelDocument.data();

//       const offerDescription = channelData.offer;

//       await pc.current.setRemoteDescription(
//         new RTCSessionDescription(offerDescription),
//       );

//       const answerDescription = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answerDescription);

//       const answer = {
//         type: answerDescription.type,
//         sdp: answerDescription.sdp,
//       };

//       await channelDoc.update({answer});
//       setRenderKey(Date.now());
//       offerCandidates.onSnapshot(snapshot => {
//         snapshot.docChanges().forEach(change => {
//           if (change.type === 'added') {
//             const data = change.doc.data();
//             pc.current.addIceCandidate(new RTCIceCandidate(data));
//           }
//         });
//       });
//     } catch (error) {
//       console.error('Error joining call:', error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.body} behavior="position">
//       <SafeAreaView>
//         {localStream && (
//           <RTCView
//             streamURL={localStream?.toURL()}
//             style={styles.stream}
//             objectFit="cover"
//             mirror
//           />
//         )}

//         {remoteStream && (
//           <RTCView
//             streamURL={remoteStream?.toURL()}
//             style={styles.stream}
//             objectFit="cover"
//             mirror
//           />
//         )}
//         <View style={styles.buttons}>
//           {!webcamStarted && (
//             <Button title="Start webcam" onPress={startWebcam} />
//           )}
//           {webcamStarted && <Button title="Start call" onPress={startCall} />}
//           {webcamStarted && (
//             <View style={{flexDirection: 'row'}}>
//               <Button title="Join call" onPress={joinCall} />
//               <TextInput
//                 value={channelId}
//                 placeholder="callId"
//                 minLength={45}
//                 style={{borderWidth: 1, padding: 5, color: '#000'}}
//                 onChangeText={newText => setChannelId(newText)}
//               />
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   body: {
//     backgroundColor: '#fff',

//     justifyContent: 'center',
//     alignItems: 'center',
//     ...StyleSheet.absoluteFill,
//   },
//   stream: {
//     flex: 2,
//     width: 200,
//     height: 200,
//   },
//   buttons: {
//     alignItems: 'flex-start',
//     flexDirection: 'column',
//   },
// });

// export default App;
