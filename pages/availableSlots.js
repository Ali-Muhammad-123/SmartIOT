import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SidebarLayout from '../layouts/sidebarLayout';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {URL} from '../config';

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function AvailableSlots({route, navigation}) {
  const [id, setId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [allSlots, setAllSlots] = useState([]);

  const [availableSlots, setAvailableSlots] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function func() {
        const id = await AsyncStorage.getItem('@id');
        axios({
          method: 'GET',
          url: `${URL}/allslots`,
        })
          .then(res => {
            console.log(res);
            setAllSlots(
              Array.from({length: res.data.total}, (_, i) => ({
                number: i + 1,
              })),
            );
            axios({
              method: 'GET',
              url: `${URL}/`,
            })
              .then(resp => {
                console.log(resp.data);
                setAvailableSlots(resp.data.map(el => ({number: `${el}`})));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      }
      func();
    }, []),
  );
  return (
    <LinearGradient
      colors={['#eedfe0', '#dbdcdc']}
      style={styles.gradientStyle}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}>
      <View style={{flex: 1, padding: 24}}>
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
                Request Submitted
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'center',
                }}>
                Thank you for your inquiry. The consultant of your choice will
                be in touch shortly.
              </Text>
              <Pressable
                style={[styles.doneButton]}
                onPress={() => navigation.goBack()}>
                <Text style={{color: '#FFF', fontSize: 17, fontWeight: '700'}}>
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <SidebarLayout header={'Available Parking Slots'} />
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
          data={allSlots}
          extraData={availableSlots}
          renderItem={({item, index}) => (
            <View
              style={{
                width: (PAGE_WIDTH - 86) / 2,
                paddingTop: 14,
                marginVertical: 11,
                marginLeft: 14,
                // paddingHorizontal: 25,
                overflow: 'hidden',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                backgroundColor: '#fff',
                position: 'relative',
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: (PAGE_WIDTH - 86) / 2,
                  height: 120,
                  transform: [{rotateY: index % 2 === 0 ? '180deg' : '0deg'}],
                }}
                source={
                  availableSlots.find(el => el.number == item.number)
                    ? require('../images/emptySlot.png')
                    : require('../images/filledSlot.png')
                }
              />
              <Text
                style={{
                  fontSize: 14,
                  flex: 1,
                  fontWeight: '600',
                  color: '#0e66ea',
                  position: 'absolute',
                  top: 65,
                  left: (PAGE_WIDTH - 180) / 4,
                }}>
                {item.number}
              </Text>
              {availableSlots.find(el => el.number == item.number) ? (
                <TouchableOpacity
                  style={{width: '100%'}}
                  onPress={() =>
                    navigation.navigate('BookSlot', {slotNo: item.number})
                  }>
                  <View
                    style={{
                      backgroundColor: '#0e66ea',
                      marginTop: 11,
                      paddingVertical: 9,
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#fff',
                        textAlign: 'center',
                      }}>
                      Book Now
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          )}
          numColumns={2}
        />
      </View>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  doneButton: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#000',
    marginTop: 40,
    marginBottom: 16,
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
