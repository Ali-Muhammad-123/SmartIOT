import {
  Dimensions,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SidebarLayout from '../layouts/sidebarLayout';
import Pdf from 'react-native-pdf';

import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from 'react-native-fs';
import {REACT_APP_BASE_URL} from '@env';
import RNFetchBlob from 'rn-fetch-blob';
import {URL} from '../config';

export default function Reservations({route, navigation}) {
  const [doc, setDoc] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [allEntries, setEntries] = useState([
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

  const downloadDocument = async item => {
    const token = await AsyncStorage.getItem('@jwt');

    const _downloadFile2 = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };
    _downloadFile2();

    const dirs = RNFetchBlob.fs.dirs;

    var path = dirs.DCIMDir + '/image.png';
    RNFetchBlob.fs
      .writeFile(path, item, 'base64')
      .then(res => {
        console.log('File : ', res);
      })
      .catch(er => console.log(er));
  };

  return (
    <LinearGradient
      colors={['#E6EFFC', '#dbdcdc']}
      style={styles.gradientStyle}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}>
      <View style={{flex: 1, padding: 24}}>
        <SidebarLayout header={'Reservations'} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{alignItems: 'flex-start', paddingTop: 12}}>
          <Image
            style={{padding: 0, alignSelf: 'flex-start'}}
            source={require('../images/BackBlack.png')}
          />
        </TouchableOpacity>
        <FlatList
          style={{paddingTop: 12}}
          data={allEntries}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'column',
                marginVertical: 11,
                // backgroundColor:'#fff'
              }}>
              <View
                style={{
                  paddingTop: 11,
                  paddingHorizontal: 29,
                  backgroundColor: '#fff',
                  flexDirection: 'column',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    flex: 1,
                    fontWeight: '600',
                    color: '#000',
                  }}>
                  Parking Lot No : {item.parkingLotNo}
                </Text>
                <Text
                  style={{
                    paddingVertical: 4,
                    fontSize: 12,
                    flex: 1,
                    fontWeight: '600',
                    color: '#000',
                  }}>
                  License No : <Text>{item.carNo}</Text>
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  paddingVertical: 14,
                }}>
                <Image
                  style={{width: 100, height: 100}}
                  source={{uri: `data:image/png;base64,${item.qrCode}`}}
                />
              </View>
              <View
                style={{
                  paddingBottom: 11,
                  paddingHorizontal: 29,
                  backgroundColor: '#fff',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      // paddingVertical: 5,
                      fontSize: 10,
                      flex: 1,
                      fontWeight: '600',
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    Expiry Date :{' '}
                  </Text>
                  <Text style={{color: '#0e66ea'}}>{item.expiryDate}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      flex: 1,
                      fontWeight: '600',
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    Status :
                  </Text>

                  <View
                    style={{
                      backgroundColor:
                        item.status === 'booked'
                          ? '#66ff00'
                          : item.status === 'Used'
                          ? '#ae9c18'
                          : item.status === 'Expired'
                          ? '#dc143c'
                          : '',
                      borderRadius: 100,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        color: '#FFF',
                      }}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#0e66ea',
                  // paddingHorizontal: 28,
                  paddingVertical: 12,
                  borderBottomRightRadius: 16,
                  borderBottomLeftRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => downloadDocument(item.qrCode)}>
                  <View
                    style={{
                      flex: 1,

                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image source={require('../images/Download.png')} />
                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 14,
                        color: '#fff',
                        paddingLeft: 10,
                      }}>
                      Download
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {doc && (
        <Pdf
          trustAllCerts={false}
          source={{
            uri: doc,
            cache: true,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientStyle: {
    width: '100%',
    height: '100%',
  },

  pdf: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
