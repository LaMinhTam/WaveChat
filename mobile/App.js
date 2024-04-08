// import React, {useEffect} from 'react';
// import {Provider} from 'react-redux';
// import store from './store/configureStore';
// import LoginStackNavigator from './navigations/LoginStackNavigator';
// import {UserDataProvider} from './contexts/auth-context';
// import {useUserData} from './contexts/auth-context';
// import TabNavigator from './navigations/TabNavigator';
// import {NavigationContainer} from '@react-navigation/native';
// import {SocketProvider} from './contexts/SocketProvider';
// import {PermissionsAndroid} from 'react-native';
// const App = () => {
//   useEffect(() => {
//     PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//     );
//   }, []);

//   return (
//     <Provider store={store}>
//       <UserDataProvider>
//         <NavigationContainer>
//           <Main></Main>
//         </NavigationContainer>
//       </UserDataProvider>
//     </Provider>
//   );
// };

// const Main = () => {
//   const {accessTokens} = useUserData();
//   return (
//     <>
//       {accessTokens ? (
//         <SocketProvider>
//           <TabNavigator />
//         </SocketProvider>
//       ) : (
//         <LoginStackNavigator />
//       )}
//     </>
//   );
// };
// export default App;

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

// App.js

import React, {useState, useEffect} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {RTCView, mediaDevices} from 'react-native-webrtc';
import SimplePeer from 'simple-peer';
import WebSocket from 'ws';

const SERVER_URL = 'ws://your-signaling-server-url';

const App = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const initWebSocket = () => {
      const socket = new WebSocket(SERVER_URL);
      socket.onopen = () => {
        console.log('WebSocket connected');
      };
      socket.onmessage = event => {
        const message = JSON.parse(event.data);
        handleMessage(message);
      };
      setWs(socket);
    };

    initWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (localStream) {
        localStream.release();
      }
    };
  }, []);

  const handleMessage = message => {
    if (message.type === 'offer') {
      handleOffer(message.offer);
    } else if (message.type === 'answer') {
      handleAnswer(message.answer);
    } else if (message.type === 'candidate') {
      handleCandidate(message.candidate);
    }
  };

  const handleOffer = offer => {
    const newPeer = new SimplePeer({
      initiator: false,
      stream: localStream,
    });

    newPeer.on('signal', data => {
      ws.send(JSON.stringify({type: 'answer', answer: data}));
    });

    newPeer.on('stream', stream => {
      setRemoteStream(stream);
    });

    newPeer.signal(offer);
    setPeer(newPeer);
  };

  const handleAnswer = answer => {
    if (peer) {
      peer.signal(answer);
    }
  };

  const handleCandidate = candidate => {
    if (peer) {
      peer.signal(candidate);
    }
  };

  const handleCall = async () => {
    const stream = await mediaDevices.getUserMedia({video: true, audio: true});
    setLocalStream(stream);

    const newPeer = new SimplePeer({
      initiator: true,
      stream: localStream,
    });

    newPeer.on('signal', data => {
      ws.send(JSON.stringify({type: 'offer', offer: data}));
    });

    newPeer.on('stream', stream => {
      setRemoteStream(stream);
    });

    setPeer(newPeer);
  };

  const handleHangup = () => {
    if (peer) {
      peer.destroy();
      setPeer(null);
      setRemoteStream(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {localStream && (
          <RTCView streamURL={localStream.toURL()} style={styles.video} />
        )}
        {remoteStream && (
          <RTCView streamURL={remoteStream.toURL()} style={styles.video} />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Call" onPress={handleCall} />
        <Button title="Hang Up" onPress={handleHangup} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flexDirection: 'row',
  },
  video: {
    width: 200,
    height: 200,
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
