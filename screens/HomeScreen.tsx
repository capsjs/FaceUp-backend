import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, keyboardAvoindingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmail, UserState } from '../reducers/user';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const EMAIL_REGEX: RegExp =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type HomeScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    user.email && navigation.navigate('TabNavigator', { screen: 'Gallery'});
   }, []);

   const handleSubmit = () => {
    if(EMAIL_REGEX.test(email)) {
      dispatch(updateEmail(email));
      navigation.navigate('TabNavigator', { screen: 'Gallery'});
    } else {
      setEmailError(true);
    }
   };

   return(
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Image style={styles.image} source={require('../assets/camera.png')} />
        <Text style={styles.title}>
          FaceUp
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
          placeholder='Email'
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
          autoComplete='email'
          onChangeText={(value) => setEmail(value)}
          value={email}
          style={styles.input}
          />
          {emailError && <Text style={styles.error}>
            Invalid email address
          </Text>}
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textButton}>
              Go to Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
   );
}
const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'rgba (255, 190, 11, 0.4)'
  },
  image: {
    width: '100%',
    height: '50%',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    fontFamily: 'Futura',
    marginBottom: 20
  },
  inputContainer: {
    width: '85%',
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 1
  },
  input: {
    width: '100%',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    fontSize: 16
  },
  button: {
    alignItems: 'center',
    paddingTop: 8,
    width:'100%',
    marginTop: 30,
    backgroundColor: '#fbe29c',
    borderRadius: 1
  },
  textButton: {
    fontFamily: 'Futura',
    height: 30,
    fontWeight: '600',
    fontSize: 16
  },
  error: {
    marginTop: 10,
    color: 'red'
  }
});