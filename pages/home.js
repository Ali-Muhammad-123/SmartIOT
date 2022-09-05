import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
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
import MenuBox from '../components/menuBox';
import SidebarLayout from '../layouts/sidebarLayout';
import {useFocusEffect} from '@react-navigation/native';
import {URL} from '../config';
import moment from 'moment';

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function Home({navigation}) {
  const swiper = useRef(null);
  const [entries, setEntries] = useState([
    {
      location: 'Walton Street , Parking lot No : 5D',
      status: 'Used',
      companyName: 'Express PRO FZ LLC',
      licenseNo: '5522114',
      expiryDate: '02-Jun-2025',
    },
    {
      location: 'Walton Street , Parking lot No : 5D',
      status: 'Booked',
      companyName: 'Express PRO FZ LLC',
      licenseNo: '321553',
      expiryDate: '02-Jun-2025',
    },
  ]);
  const progressValue = useSharedValue(0);

  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH * 0.85 - 90,
    height: '100%',
  };

  useFocusEffect(
    React.useCallback(() => {
      async function func() {
        const id = await AsyncStorage.getItem('@id');
        axios({
          method: 'GET',
          url: `${URL}/book?id=${id}`,
        }).then(response => {
          console.log(response.data.bookings);
          setEntries(
            response.data.bookings.map(el => ({
              parkingLotNo: el[1],
              carNo: el[2],
              expiryDate: el[4],
              status: el[5],
              firstName: el[6],
              lastName: el[7],
              phone: el[8],
              email: el[9],
              qrCode: el[13],
            })),
          );
        });
      }
      func();
    }, []),
  );

  return (
    <LinearGradient
      colors={['#E6EFFC', '#dbdcdc']}
      style={styles.gradientStyle}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}>
      <View style={{flex: 1, padding: 24}}>
        <SidebarLayout header={'Walmart Parking Space'} />

        <View style={{paddingTop: 24, flexDirection: 'row'}}>
          {/* <TouchableOpacity
            onPress={() => {
              setEntries([
                ...entries,
                {
                  documentType: 'Trade License',
                  status: 'Active',
                  companyName: 'Express PRO FZ LLC',
                  licenseNo: '5522114',
                  expiryDate: '02-Jun-2025',
                },
              ]);
            }}>
            <View
              style={{
                backgroundColor: '#e3dede',
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 0, 0.15)',
                height: 180,
                width: 50,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{padding: 0, alignSelf: 'center'}}
                source={require('../images/X_Mark.png')}
              />
            </View>
          </TouchableOpacity> */}

          <Carousel
            {...baseOptions}
            loop={false}
            ref={swiper}
            style={{width: '100%', paddingLeft: 0, height: 180}}
            autoPlay={false}
            autoPlayInterval={2000}
            onProgressChange={(_, absoluteProgress) =>
              (progressValue.value = absoluteProgress)
            }
            data={entries}
            pagingEnabled={true}
            onSnapToItem={index => console.log('current index:', index)}
            renderItem={({item, index}) => {
              // console.log(item);
              return (
                <View style={{flex: 1, marginRight: 20}}>
                  <ImageBackground
                    source={require('../images/CardBG.png')}
                    resizeMode="stretch"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 25,
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        paddingVertical: 17,
                        backgroundColor: '#fff',
                        borderRadius: 25,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '700',
                            color: '#808487',
                          }}>
                          Parking Lot No : {item.parkingLotNo}
                        </Text>
                        <View
                          style={{
                            paddingVertical: 3,
                            paddingHorizontal: 12,
                            backgroundColor: '#1A8E2D',
                            borderRadius: 30,
                          }}>
                          <Text
                            style={{
                              fontSize: 8,
                              fontWeight: '700',
                              color: '#fff',
                            }}>
                            {item.status}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          resizeMode="contain"
                          resizeMethod="scale"
                          style={{height: '100%', width: '100%'}}
                          source={{uri: `data:image/png;base64,${item.qrCode}`}}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 8,
                              fontWeight: '500',
                              color: '#0e66ea',
                            }}>
                            License No:
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '700',
                              color: '#000',
                            }}>
                            {item.carNo}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 8,
                              fontWeight: '500',
                              color: '#0e66ea',
                              textAlign: 'right',
                            }}>
                            Expiry
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '700',
                              color: '#000',
                              textAlign: 'right',
                            }}>
                            {moment(item.expiryDate).format('MMM Do YYYY')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              );
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            alignSelf: 'center',
            paddingVertical: 24,
          }}>
          {entries.map((data, index) => {
            return (
              <PaginationItem
                backgroundColor={'#0e66ea'}
                animValue={progressValue}
                index={index}
                key={index}
                length={entries.length}
              />
            );
          })}
        </View>
        <ScrollView style={{height: '100%', width: '100%', marginBottom: 60}}>
          <View
            style={{
              paddingVertical: 24,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('LiveStream')}>
              <MenuBox
                image={require('../images/parking.png')}
                PAGE_WIDTH={PAGE_WIDTH}
                title="Reserve Parking Space"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Reservations')}>
              <MenuBox
                image={require('../images/parkingHistory.png')}
                PAGE_WIDTH={PAGE_WIDTH}
                title="Reservations"
              />
            </TouchableOpacity>
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
});

const PaginationItem = props => {
  const {animValue, index, length, backgroundColor} = props;
  const width = 10;
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: 'white',
        marginHorizontal: 3,
        width: width,
        height: width,
        borderRadius: 50,
        overflow: 'hidden',
        transform: [
          {
            rotateZ: '0deg',
          },
        ],
      }}>
      <Animated.View
        style={[
          {
            borderRadius: 50,
            width: 10,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};
