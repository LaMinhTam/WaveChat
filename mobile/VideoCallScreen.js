import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import SimplePeer from 'simple-peer';

const VideoCallScreen = () => {
  const [outgoingSignal, setOutgoingSignal] = useState('');
  const [incomingSignal, setIncomingSignal] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  const peer = new SimplePeer({
    initiator: false, // Change this based on whether this peer is the initiator or not
    trickle: false, // Disable trickle ICE to simplify signaling
  });

  useEffect(() => {
    peer.on('signal', data => {
      // Handle outgoing signal
      setOutgoingSignal(JSON.stringify(data));
    });

    peer.on('connect', () => {
      // Connection established
      peer.send('Hey, how are you?');
    });

    peer.on('data', data => {
      // Received message from remote peer
      setReceivedMessage(data.toString());
    });

    // Clean up event listeners
    return () => {
      peer.destroy();
    };
  }, []);

  const handleSubmit = () => {
    // Parse and handle incoming signal
    const signalData = JSON.parse(incomingSignal);
    peer.signal(signalData);
  };

  const handleSend = () => {
    // Send message to remote peer
    peer.send('Hello from this side!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={incomingSignal}
          onChangeText={setIncomingSignal}
          placeholder="Paste incoming signal here"
        />
        <Button onPress={handleSubmit} title="Submit" />
      </View>
      <Text style={styles.label}>Outgoing Signal:</Text>
      <Text style={styles.signal}>{outgoingSignal}</Text>
      <View style={styles.messageContainer}>
        <Text style={styles.label}>Received Message:</Text>
        <Text style={styles.message}>{receivedMessage}</Text>
      </View>
      <Button onPress={handleSend} title="Send Message" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 250,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  signal: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 20,
  },
  messageContainer: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
  },
});

export default VideoCallScreen;
