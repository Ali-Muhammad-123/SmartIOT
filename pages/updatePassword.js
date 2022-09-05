import {
  ImageBackground,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import TextField from '../components/inputField';
import React, {useState, useRef, useEffect} from 'react';
import IntlPhoneInput from 'react-native-international-telephone-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';

export default function UpdatePassword({navigation}) {
  const [id, setId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getMyStringValue = async () => {
      try {
        setId(await AsyncStorage.getItem('@id'));
        console.log(`${id} mila`);
      } catch (e) {
        console.log(e);
      }
    };
    getMyStringValue();
  }, []);

  async function sendData(id) {
    console.log(`${id} aa gya`);
    setLoader(true);
    axios({
      method: 'PUT',
      url: `${REACT_APP_BASE_URL}/credential?id=${id}`,
      data: {
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      },
    })
      .then(res => {
        setLoader(false);
        console.log(res.data.message);
        Alert.alert(
          'Success',
          `${
            res.data.message ? res.data.message : 'password changed sucessfully'
          }`,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
        navigation.goBack();
      })
      .catch(err => {
        setLoader(false);
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err);
        Alert.alert(
          'Failed',
          `${
            err.response.data.message
              ? err.response.data.message
              : 'Something went wrong'
          }`,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
      });
  }

  return (
    <View style={{height: '100%'}}>
      <ImageBackground
        source={require('../images/SignIn.jpg')}
        style={{width: '100%', height: 300}}>
        <View style={styles.topheader}>
          <View style={styles.textView}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{alignItems: 'flex-start', padding: 0}}>
              <Image
                style={{padding: 0, alignSelf: 'flex-start'}}
                source={require('../images/Back.png')}
              />
            </TouchableOpacity>
            <Text style={styles.textStyle}></Text>
            <Text style={[styles.textStyle, {paddingBottom: 20}]}>
              Change Password
            </Text>
            <Text style={styles.textStyle2}>
              You will receive an OTP on your registered mobile number to
              confirm any password changes.
            </Text>
            {/* <Text style={styles.textStyle2}>
              registered mobile number to make
            </Text> */}
            {/* <Text style={styles.textStyle2}>this change.</Text> */}
          </View>
        </View>
      </ImageBackground>
      <ScrollView style={styles.bottomSection}>
        <View style={{height: '100%', padding: 24}}>
          <View style={{marginBottom: 20}}>
            <Text style={styles.label}>Current Password</Text>
            <TextField
              label="Password"
              secureTextEntry
              onChangeText={text => setCurrentPassword(text)}
              left={
                <TextInput.Icon
                  name={() => (
                    <Image source={require('../images/password_icon.png')} />
                  )}
                />
              }
              right={
                <TextInput.Icon
                  name={() => (
                    <TouchableOpacity>
                      <Image source={require('../images/Hide.png')} />
                    </TouchableOpacity>
                  )}
                />
              }
            />
          </View>

          <View style={{marginBottom: 20}}>
            <Text style={styles.label}>New Password</Text>
            <TextField
              label="Password"
              secureTextEntry
              onChangeText={text => setNewPassword(text)}
              left={
                <TextInput.Icon
                  name={() => (
                    <Image source={require('../images/password_icon.png')} />
                  )}
                />
              }
              right={
                <TextInput.Icon
                  name={() => (
                    <TouchableOpacity>
                      <Image source={require('../images/Hide.png')} />
                    </TouchableOpacity>
                  )}
                />
              }
            />
          </View>

          <View style={{marginBottom: 20}}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextField
              label="Password"
              secureTextEntry
              onChangeText={text => setConfirmPassword(text)}
              left={
                <TextInput.Icon
                  name={() => (
                    <Image source={require('../images/password_icon.png')} />
                  )}
                />
              }
              right={
                <TextInput.Icon
                  name={() => (
                    <TouchableOpacity>
                      <Image source={require('../images/Hide.png')} />
                    </TouchableOpacity>
                  )}
                />
              }
            />
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={async () => {
              await sendData(id);
            }}>
            <Text style={{textAlign: 'center', fontSize: 20, color: '#FFF'}}>
              Save Changes
            </Text>
          </TouchableOpacity>

          <View style={{width: '100%', marginBottom: 40}}>
            <View
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={async () => {
                  navigation.goBack();
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#CF3339',
                    fontWeight: 'bold',
                  }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topheader: {
    height: 300,
    padding: 24,
    flex: 1,
    justifyContent: 'flex-end',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'inter',
  },
  textStyle2: {
    fontSize: 16,
    fontFamily: 'inter',
    fontWeight: '400',
    color: '#FFF',
  },
  label: {
    fontSize: 16,
    fontFamily: 'inter',
    fontWeight: 'bold',
    color: '#000000',
  },

  bottomSection: {
    backgroundColor: '#f1f1f1',
    height: '100%',
    width: '100%',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.20)',
    roundness: 10,
    width: '100%',
    height: 60,
    backgroundColor: '#ffffff',
  },
  signInButton: {
    width: '100%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#CF3339',
    marginBottom: 16,
  },
});
