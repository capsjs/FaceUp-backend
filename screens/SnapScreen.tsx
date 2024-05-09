import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraView } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { addPhoto } from '../reducers/user';
import { useIsFocused } from '@react-navigation/native';
import GalleryScreen from './GalleryScreen';

export default function SnapScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [facing, setFacing] = useState('back');
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.3 });
        const formData = new FormData();
        formData.append('photoFromFront', {
          uri: photo.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
        const response = await fetch(`http://192.168.1.149:3000/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await response.json();
        if (data.result) {
          dispatch(addPhoto(data.url));
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false && !isFocused) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <FontAwesome name='rotate-right' size={25} color='#ffffff' />
          </TouchableOpacity>
        </View>
          <View style={styles.snapContainer}>
          <TouchableOpacity onPress={takePicture}>
            <FontAwesome name='circle-thin' style={styles.button} size={95} color='#ffffff' />
          </TouchableOpacity>
          </View>
      </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50,
  },
  snapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 25,
    marginBottom: 10
  },
});