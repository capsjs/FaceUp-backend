import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { addPhoto } from '../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';

const BACKEND_ADDRESS = 'http://BACKEND_IP:3000';

export default function SnapScreen() {

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState('off');
  let cameraRef: any = useRef(null);

  if(!permission){
    return <View />
  };

  if (!permission.granted || !isFocused) {
    return (
       <View>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
       );
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  const handleFlashMode = () => {
      if (flashMode === 'on') {
          setFlashMode('off');
        } else if (flashMode === 'off') {
            setFlashMode('on');
          } else {
              setFlashMode('auto')
            }
          };

const handleCameraReady = () => {
  console.log('camera is ready'); 
};
 
const takePicture = async () => {
  if(!cameraRef.current) {
    console.log('Camera reference is not available.');
    return;
  }
  try {
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.3 });
    const formdata = new FormData();
    const uri = photo?.uri;
    formdata.append('photoFromFront', {
      uri: uri,
      name: 'photo.jpg',
      type: 'image/jpeg,'
    });
    const response = await fetch(`${BACKEND_ADDRESS}/upload`, {
      method: 'POST',
      body: formdata,
    });
    if(!response.ok) {
      throw new Error('Failed to upload photo');
    }
    const data = await response.json();
    if(data.result) {
      dispatch(addPhoto(data.uri));
    }
  } catch (error) {
    console.error('Error taking picture:', error);
  }
  };
  
return (
  <CameraView style={styles.camera}
    facing={facing}
    ref={ref => { cameraRef.current = ref}}
    onCameraReady= {handleCameraReady}
  >
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        onPress={toggleCameraFacing}
        style={styles.button}
      >
        <FontAwesome name='rotate-right'
          size={25}
          color='#ffffff'
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleFlashMode}
        style={styles.button}
      >
        <FontAwesome name='flash'
          size={25}
          color={flashMode === 'off' ? '#ffffff' : '#e8be4b' }
        />
      </TouchableOpacity>
    </View>
    <View style={styles.snapContainer}>
      <TouchableOpacity 
        onPress={() => cameraRef && takePicture()}>
          <FontAwesome name='circle-thin'
            size={95}
            color='#ffffff'
          />
      </TouchableOpacity>
    </View>
  </CameraView>
);
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:'space-between',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  button: {
    width: 44,
    height:44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50
  },
  snapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'flex-end',
    paddingBottom: 25
  },
});