import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import TextField from '../components/inputField';
import axios from 'axios';

import {REACT_APP_BASE_URL} from '@env';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useFocusEffect} from '@react-navigation/native';

import ReactNativeBiometrics from 'react-native-biometrics';
import {URL} from '../config';
import {setSidebar} from '../reducers/sidebar';
import {useDispatch} from 'react-redux';

const rnBiometrics = new ReactNativeBiometrics();

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function SignIn({navigation}) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  let payload = Math.round(new Date().getTime() / 1000).toString();
  const dispatch = useDispatch();
  getMyStringValue = async () => {
    try {
      const jwt = await AsyncStorage.getItem('@jwt');
      const id = await AsyncStorage.getItem('@id');
      // console.log(jwt);
      navigate(id);
    } catch (e) {
      console.log(e);
    }
  };

  function navigate(jwt) {
    if (id !== null) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'HomeStack'}],
        }),
      );
    }
  }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getMyStringValue();
  //   }, []),
  // );

  function verifySignatureWithServer(signature, payload, id) {
    // setLoader(true);
    // console.log(id);
    // axios({
    //   method: 'POST',
    //   url: `${REACT_APP_BASE_URL}/verifyBiometric?id=${id}`,
    //   data: {
    //     signature,
    //     payload,
    //   },
    // })
    //   .then(async res => {
    //     await AsyncStorage.setItem('@jwt', res.data.token);
    //     setLoader(false);
    //     navigation.navigate('HomeStack');
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  async function useFingerprint() {
    // const id = await AsyncStorage.getItem('@id');
    // rnBiometrics.biometricKeysExist().then(resultObject => {
    //   const {keysExist} = resultObject;
    //   if (keysExist) {
    //     rnBiometrics
    //       .createSignature({
    //         promptMessage: 'Sign in',
    //         payload: payload,
    //       })
    //       .then(resultObject => {
    //         const {success, signature} = resultObject;
    //         console.log(signature);
    //         if (success) {
    //           console.log(payload);
    //           verifySignatureWithServer(signature, payload, id);
    //         }
    //       });
    //   }
    // });
  }

  function signIn() {
    setLoader(true);
    axios({
      timeout: 20000,
      method: 'POST',

      url: `${URL}/login`,
      data: {
        email: email,
        password: password,
      },
    })
      .then(async res => {
        console.log(res.data);
        console.log(res.data.id);
        await AsyncStorage.setItem('@id', `${res.data.id}`);
        dispatch(setSidebar(true));
        setLoader(false);
        navigation.navigate('HomeStack');
      })
      .catch(er => {
        setLoader(false);
        console.log(er);

        Alert.alert('Failed', `${'Something went wrong'}`, [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      });
  }

  return (
    <View style={{height: '100%'}}>
      {!loader ? (
        <View style={{height: '100%'}}>
          <ImageBackground
            source={require('../images/SignIn.jpg')}
            style={{width: '100%', height: 250}}>
            <View style={styles.topheader}>
              <View style={styles.textView}>
                <Text style={styles.textStyle}>Sign In</Text>
                <Text style={[styles.textStyle, {paddingBottom: 20}]}>
                  To Your Account
                </Text>
                {/* <Text style={styles.textStyle2}>
                  Sign with username or email and password to use your account.
                </Text> */}
              </View>
            </View>
          </ImageBackground>
          <ScrollView style={styles.bottomSection}>
            <View style={{height: '100%', padding: 24}}>
              <View style={{paddingBottom: 20}}>
                <TextField
                  style={{marginBottom: 5}}
                  label="Email Address"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  left={
                    <TextInput.Icon
                      name={() => (
                        <Image
                          resizeMode="contain"
                          style={{width: 25}}
                          source={require('../images/EnvelopeClosed.png')}
                        />
                      )}
                    />
                  }
                />
                {/* <TouchableOpacity style={{alignSelf: 'flex-end'}}>
                  <Text style={styles.forgotButtonStyle}>Forgot Email ID?</Text>
                </TouchableOpacity> */}
              </View>
              <View style={{paddingBottom: 20}}>
                <TextField
                  style={{marginBottom: 5}}
                  label="Password"
                  secureTextEntry={showPassword ? false : true}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  left={
                    <TextInput.Icon
                      name={() => (
                        <Image
                          resizeMode="contain"
                          style={{width: 25}}
                          source={require('../images/password_icon.png')}
                        />
                      )}
                    />
                  }
                  right={
                    <TextInput.Icon
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}
                      name={() =>
                        showPassword ? (
                          <Image
                            resizeMode="contain"
                            style={{width: 25}}
                            source={require('../images/eyeOpen.png')}
                          />
                        ) : (
                          <Image
                            resizeMode="contain"
                            style={{width: 25}}
                            source={require('../images/Hide.png')}
                          />
                        )
                      }
                    />
                  }
                />
                {/* <TouchableOpacity style={{alignSelf: 'flex-end'}}>
                  <Text style={styles.forgotButtonStyle}>Forgot Password?</Text>
                </TouchableOpacity> */}
              </View>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => {
                  if (email !== null && password !== null) {
                    signIn();
                  }
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 20, color: '#FFF'}}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <View style={{width: '100%', height: 50}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{fontSize: 14, fontWeight: '500', paddingRight: 5}}>
                    Don’t have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#0e66ea',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                      }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <TouchableOpacity
                  onPress={() => {
                    useFingerprint();
                  }}
                  style={{
                    flex: 2,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flex: 2,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image source={require('../images/FingerprintScan.png')} />
                    <Text style={{width: 100, textAlign: 'center'}}>
                      Login with Fingerprint
                    </Text>
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <Image source={require('../images/Loading.png')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topheader: {
    height: 250,
    padding: 24,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  textStyle: {fontSize: 35, fontWeight: 'bold', color: '#FFF'},
  textStyle2: {fontSize: 16, fontWeight: '400', color: '#FFF'},
  bottomSection: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
    height: '100%',
    width: '100%',
  },
  forgotButtonStyle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#777777',
  },
  signInButton: {
    width: '100%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#0e66ea',
    marginBottom: 15,
  },
});
