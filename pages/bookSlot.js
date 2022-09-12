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

import axios from 'axios';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';
import TextField from '../components/inputField';
import SidebarLayout from '../layouts/sidebarLayout';
import {ScrollView} from 'react-native-gesture-handler';
import {socket} from '../sockets/socketConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {URL} from '../config';

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function BookSlot({route, navigation}) {
  const [carId, setCarID] = useState('');
  const [message, setMessage] = useState('');
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [displayedDate, setdisplayedDate] = useState(moment());

  const [id, setId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [negativeModalVisible, setNegativeModalVisible] = useState(false);

  // const {slotNo} = route.params;
  //   useEffect(() => {
  //     getMyStringValue = async () => {
  //       try {
  //         setId(await AsyncStorage.getItem('@id'));
  //         console.log(`${id} mila`);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };
  //     getMyStringValue();
  //   }, []);

  async function sendData() {
    const userId = await AsyncStorage.getItem('@id');
    axios({
      method: 'POST',
      url: `${URL}/book`,
      data: {
        parking_no: `${slotNo}`,
        car_number: carId,
        user_id: userId,
        amount:
          startDate && endDate
            ? `${(moment.duration(endDate.diff(startDate)).asDays() + 1) * 100}`
            : '0',
      },
    })
      .then(async res => {
        setModalVisible(true);
      })
      .catch(er => {
        setModalVisible(true);
      });
  }

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
                Parking slot No {slotNo} has been booked , You can check your
                bookings for more information.
              </Text>
              <Pressable
                style={[styles.signInButton]}
                onPress={() => navigation.navigate('Reservations')}>
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
        <SidebarLayout header={'Book a slot'} />
        <ScrollView
          style={{
            width: PAGE_WIDTH - 48,
            height: PAGE_HEIGHT,
            // marginBottom: 70,
            marginTop: 30,
          }}>
          <View style={{paddingHorizontal: 24, alignItems: 'center'}}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 14,
                textAlign: 'center',
                color: '#131313',
              }}>
              Please fill out the following details to book parking slot no :{' '}
              {slotNo}
            </Text>
          </View>
          <View
            style={{
              height: PAGE_HEIGHT,
              flexDirection: 'column',
            }}>
            <View style={{alignItems: 'center'}}>
              <DateRangePicker
                onChange={data => {
                  console.log(data);
                  data.startDate
                    ? setstartDate(data.startDate)
                    : setendDate(data.endDate);
                }}
                // containerStyle={{}}
                endDate={endDate}
                startDate={startDate}
                displayedDate={displayedDate}
                backdropStyle={{backgroundColor: 'transparent'}}
                range>
                <View
                  style={{
                    marginTop: 24,
                    height: 54,
                    width: PAGE_WIDTH - 48,
                    backgroundColor: '#f6f6f6',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#bdc2c7',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>Select Duration</Text>
                </View>
              </DateRangePicker>
            </View>

            <TextField
              style={{marginTop: 24}}
              label="Car No."
              value={carId}
              onChangeText={text => {
                setCarID(text);
              }}
            />
            <View
              style={{
                paddingVertical: 24,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                <Text>£</Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: '#0e66ea',
                    paddingLeft: 5,
                  }}>
                  {startDate &&
                    endDate &&
                    (moment.duration(endDate.diff(startDate)).asDays() + 1) *
                      100}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                <Text
                  style={{fontSize: 25, fontWeight: '700', color: '#0e66ea'}}>
                  {startDate &&
                    endDate &&
                    moment.duration(endDate.diff(startDate)).asDays() + 1}{' '}
                </Text>

                <Text>Days</Text>
              </View>
            </View>
            <Pressable style={[styles.signInButton]} onPress={() => sendData()}>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
