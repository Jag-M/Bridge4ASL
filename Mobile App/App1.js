import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'
//import '@tensorflow/tfjs-backend-webgl';
//import '@tensorflow/tfjs-backend-cpu';
import * as mobilenet from '@tensorflow-models/mobilenet';
//import '@tensorflow/tfjs-backend-wasm';

//tf.setBackend('wasm').then(() => App());

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  let model = null

  async function loadModel() {
    await tf.setBackend('rn-webgl');
    model = await tf.loadLayersModel("https://raw.githubusercontent.com/Jag-M/Bridge4ASL/main/browsertest/model.json")
    //const model = await mobilenet.load();
    console.log(model.summary());
    
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      await tf.ready();
    })();
  }, []);


  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({base64: true});
      console.log(photo.uri);
      console.log(tf.getBackend())
      // tf.ready().then(_ => {
      //   loadModel();
      // });
      await loadModel();
      //console.log(model.predict(photo))
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      />
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 15,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});
