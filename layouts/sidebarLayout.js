import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Switch} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useSwipe} from '../customHooks/useSwipe';
import {CommonActions} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {setSidebar} from '../reducers/sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

const sidebarLayout = ({header, subheader}) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const {sidebar} = useSelector(state => state.sidebar);
  const [photo1, setPhoto1] = React.useState(require('../images/zaby.png'));
  const [faceId, setFaceId] = React.useState(false);
  const [fingerprint, setFingerprint] = React.useState(false);
  const [email, setEmail] = React.useState(null);
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  var leftValue = React.useRef(new Animated.Value(-PAGE_WIDTH)).current;

  let payload = Math.round(new Date().getTime() / 1000).toString();

  async function verifySignatureWithServer(signature, payload) {
    await axios({
      method: 'POST',
      url: `${REACT_APP_BASE_URL}/verifyBiometric?id=${userId}`,
      data: {
        signature,
        payload,
      },
    });
  }

  function useFingerprint() {
    if (fingerprint) {
      rnBiometrics.deleteKeys().then(resultObject => {
        const {keysDeleted} = resultObject;

        if (keysDeleted) {
          console.log('Successful deletion');
          setFingerprint(!fingerprint);
        } else {
          console.log(
            'Unsuccessful deletion because there were no keys to delete',
          );
        }
      });
    } else {
      rnBiometrics.biometricKeysExist().then(resultObject => {
        const {keysExist} = resultObject;

        if (!keysExist) {
          rnBiometrics.createKeys().then(async resultObject => {
            const {publicKey} = resultObject;
            console.log(publicKey);
            await axios({
              method: 'PUT',
              url: `${REACT_APP_BASE_URL}/publickey?id=${userId}`,
              data: {publicKey: publicKey},
            });

            rnBiometrics
              .createSignature({
                promptMessage: 'Sign in',
                payload: payload,
              })
              .then(resultObject => {
                const {success, signature} = resultObject;
                setFingerprint(!fingerprint);
                console.log(signature);
                if (success) {
                  console.log(payload);
                  verifySignatureWithServer(signature, payload);
                }
              });
          });
        }
      });
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('@id');
  }

  moveLR = () => {
    Animated.timing(leftValue, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => dispatch(setSidebar(true)));
  };

  moveRL = () => {
    Animated.timing(leftValue, {
      toValue: -PAGE_WIDTH,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => dispatch(setSidebar(false)));
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity style={{padding: 0}} onPress={() => moveLR()}>
        <Image
          style={{padding: 0, alignSelf: 'flex-start', width: 28, height: 20}}
          source={require('../images/hamburger.png')}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingLeft: 20,
          justifyContent: 'flex-start',
        }}>
        <Text
          style={{
            fontSize: subheader ? 16 : 20,
            fontWeight: '700',
            color: '#222222',
          }}>
          {header}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            color: '#3E3E3E',
            opacity: 0.4,
            display: subheader ? 'flex' : 'none',
          }}>
          {subheader}
        </Text>
      </View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          transform: [{translateX: leftValue}],
          zIndex: 20,
        }}>
        <View
          style={{
            width: PAGE_WIDTH * 0.8,
            height: PAGE_HEIGHT,
            position: 'absolute',
            zIndex: 100,
            top: -24,
            left: -24,
            flex: 1,
            zIndex: 2,

            padding: 24,
          }}>
          <LinearGradient
            colors={['#131313', '#241515']}
            style={{
              width: PAGE_WIDTH * 0.8,
              height: PAGE_HEIGHT,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            start={{x: 1.0, y: 0}}
            end={{x: 0, y: 1}}
          />
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            style={{width: '100%', height: '100%'}}>
            <View
              style={{
                justifyContent: 'center',
                // alignItems: 'center',
                paddingTop: 28,
                position: 'relative',
              }}>
              <TouchableOpacity
                onPress={() => moveRL()}
                style={{position: 'absolute', right: 0, top: 16}}>
                <Image source={require('../images/x.png')} />
              </TouchableOpacity>

              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 15,
                  color: '#fff',
                  paddingTop: 10,
                }}>
                Hey, We’re Smart IOT
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 10,
                }}>
                <Text
                  style={{
                    fontWeight: '800',
                    fontSize: 24,
                    color: '#fff',
                    // paddingTop: 10,
                  }}>
                  The
                </Text>
                <Text
                  style={{
                    fontWeight: '800',
                    fontSize: 24,
                    color: '#0e66ea',
                    paddingLeft: 5,
                  }}>
                  #1
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 24,
                  color: '#fff',
                  paddingTop: 5,
                }}>
                IOT Smart
              </Text>
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 24,
                  color: '#fff',
                  paddingTop: 5,
                }}>
                Parking System
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'flex-start',
                paddingTop: 29,
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 14,
                  color: '#9CA4AB',
                }}>
                Quick Menu
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('AddCompany')}>
                <View
                  style={{
                    paddingTop: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={require('../images/briefcase.png')}
                  />

                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 14,
                      paddingLeft: 16,
                      color: '#FFF',
                    }}>
                    Check Live Feed
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flex: 1,
                paddingTop: 20,
                paddingBottom: 38,
              }}>
              <TouchableOpacity
                onPress={() => {
                  logout();
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [{name: 'SignIn'}],
                    }),
                  );
                }}>
                <Text
                  style={{fontWeight: '500', fontSize: 16, color: '#0e66ea'}}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

export default sidebarLayout;

const styles = StyleSheet.create({});
