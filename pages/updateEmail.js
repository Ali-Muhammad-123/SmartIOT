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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';

export default function UpdateEmail({navigation}) {
  const [previousEmail, setPreviousEmail] = useState(null);
  const [email, setEmail] = useState(null);
  const [id, setId] = useState(null);
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
    axios({
      method: 'PUT',
      url: `${REACT_APP_BASE_URL}/user?id=${id}`,
      data: {
        email: email,
      },
    })
      .then(res => {
        console.log(res.message);
        navigation.navigate('MyAccount');
      })
      .catch(err => {
        console.log(err);
        Alert.alert('', `${err.response}`, [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      });
  }

  return (
    <View style={{height: '100%'}}>
      <ImageBackground
        source={require('../images/SignIn.jpg')}
        style={{width: '100%', height: 300}}>
        <View style={styles.topheader}>
          <View style={styles.textView}>
            <TouchableOpacity style={{alignItems: 'flex-start', padding: 0}}>
              <Image
                style={{padding: 0, alignSelf: 'flex-start'}}
                source={require('../images/Back.png')}
              />
            </TouchableOpacity>
            <Text style={styles.textStyle}></Text>
            <Text style={[styles.textStyle, {paddingBottom: 20}]}>
              Update Email Address
            </Text>
            <Text style={styles.textStyle2}>
              You'll need to enter OTP received on your
            </Text>
            <Text style={styles.textStyle2}>
              registered mobile number to make
            </Text>
            <Text style={styles.textStyle2}>this change.</Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.bottomSection}>
        <View style={{height: '100%', padding: 24}}>
          <SafeAreaView style={{marginBottom: 20}}>
            <Text style={styles.label}>Email Address</Text>
            <TextField
              label="Email Address"
              onChangeText={text => setEmail(text)}
              left={
                <TextInput.Icon
                  name={() => (
                    <Image source={require('../images/EnvelopeClosed.png')} />
                  )}
                />
              }
            />
          </SafeAreaView>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={async () => {
              await sendData(id);
              navigation.navigate('MyAccount');
            }}>
            <Text style={{textAlign: 'center', fontSize: 20, color: '#FFF'}}>
              Save Changes
            </Text>
          </TouchableOpacity>

          <View style={{width: '100%', marginBottom: 40}}>
            <View
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('MyAccount')}>
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
