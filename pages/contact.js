import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import TextField from '../components/inputField';
import SidebarLayout from '../layouts/sidebarLayout';
import {ScrollView} from 'react-native-gesture-handler';
import {socket} from '../sockets/socketConfig';

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function Home({navigation}) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [id, setId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [negativeModalVisible, setNegativeModalVisible] = useState(false);

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

  return (
    <LinearGradient
      colors={['#E6EFFC', '#dbdcdc']}
      style={styles.gradientStyle}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}>
      <View style={{height: '100%', padding: 24}}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View
            style={[
              styles.centeredView,
              modalVisible ? {backgroundColor: 'rgba(0,0,0,0.5)'} : '',
            ]}>
            <View style={styles.modalView}>
              <Image
                style={{width: 150, height: 150}}
                resizeMode="contain"
                source={require('../images/Icon.png')}
              />

              <Text
                style={{
                  paddingTop: 31,
                  fontSize: 24,
                  fontWeight: '500',
                  color: '#1A8E2D',
                  textAlign: 'center',
                }}>
                Thank You
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'center',
                }}>
                We have received your message and will contact you as soon as
                possible.
              </Text>
              <Pressable
                style={[styles.doneButton]}
                onPress={() => navigation.goBack()}>
                <Text style={{color: '#FFF', fontSize: 17, fontWeight: '700'}}>
                  Go Back
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={negativeModalVisible}
          onRequestClose={() => {
            setNegativeModalVisible(!negativeModalVisible);
          }}>
          <View
            style={[
              styles.centeredView,
              modalVisible ? {backgroundColor: 'rgba(0,0,0,0.5)'} : '',
            ]}>
            <View style={styles.modalView}>
              <Image
                style={{width: 150, height: 150}}
                resizeMode="contain"
                source={require('../images/failedIcon.png')}
              />

              <Text
                style={{
                  paddingTop: 31,
                  fontSize: 24,
                  fontWeight: '500',
                  color: '#0e66ea',
                  textAlign: 'center',
                }}>
                Missing Details
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'center',
                }}>
                Please ensure to fill in all the mandatory fields to get
                started.
              </Text>
              <Pressable
                style={[styles.doneButton]}
                onPress={() => setNegativeModalVisible(!negativeModalVisible)}>
                <Text style={{color: '#FFF', fontSize: 17, fontWeight: '700'}}>
                  Go Back
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <SidebarLayout header={'Contact'} />
        <ScrollView style={{width: '100%', width: '100%', marginBottom: 70}}>
          <View
            style={{
              paddingVertical: 24,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                backgroundColor: '#131313',
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 14,
                  color: '#FFFFFF',
                }}>
                Main Office
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{flex: 1, flexWrap: 'wrap', color: '#000'}}>
                Greenwich University
              </Text>
              <View style={{alignItems: 'center'}}>
                <Image
                  resizeMode="contain"
                  source={require('../images/Location.png')}
                />
                <Text style={{fontWeight: '700', fontSize: 10, color: '#000'}}>
                  Get Directions
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#0e66ea',
                paddingHorizontal: 28,
                paddingVertical: 6,
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={require('../images/Phone.png')} />
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 14,
                    color: '#fff',
                    paddingLeft: 10,
                  }}>
                  Call Us Now
                </Text>
              </View>

              <View
                style={{
                  flex: 1,

                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={require('../images/Line.png')} />
              </View>
              <View
                style={{
                  flex: 1,

                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image source={require('../images/chat.png')} />
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 14,
                    color: '#fff',
                    paddingLeft: 10,
                  }}>
                  Chat with Us
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 24, alignItems: 'center'}}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 14,
                textAlign: 'center',
                color: '#131313',
              }}>
              Do you have any question for us? Send us a message below and we
              will get back to you shortly.
            </Text>
          </View>
          <View>
            <TextField
              style={{marginTop: 24}}
              label="Subject"
              onChangeText={text => {
                setSubject(text);
              }}
            />
            <TextField
              style={{marginTop: 24}}
              label="Your Message"
              multiline
              numberOfLines={4}
              onChangeText={text => {
                setMessage(text);
              }}
            />
            <Pressable
              style={[styles.signInButton]}
              onPress={() => sendData(id)}>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 17,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Send
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientStyle: {
    width: '100%',
    height: '100%',
  },
  signInButton: {
    width: '100%',
    marginTop: 22,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#0e66ea',
  },
});
