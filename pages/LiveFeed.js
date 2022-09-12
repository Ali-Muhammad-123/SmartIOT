import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SidebarLayout from '../layouts/sidebarLayout';
import Pdf from 'react-native-pdf';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {useWindowDimensions} from 'react-native';
import {URL} from '../config';
import WebView from 'react-native-webview';
import MenuBox from '../components/menuBox';

const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function LiveFeed({route, navigation}) {
  const [setFrame, frame] = useState(null);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const {width} = useWindowDimensions();
  //   axios({
  //     method: 'GET',
  //     url: 'http://192.168.0.103:5000/',

  //     signal: controller.signal,
  //   }).then(response => {
  //     // Read stream and store images in 'setFrame' using URL.createObjectURL.
  //     // Don't forget to call URL.revokeObjectURL when image is no longer needed.
  //     setFrame(URL.createObjectURL(response));
  //     console.log(response);
  //   });

  //   return () => controller.abort();
  // });

  // async function sendInquiry(name) {
  //   socket.emit(
  //     'recieveNotification',
  //     id,
  //     `Business Support Inquiry`,
  //     `requested for an inquiry regarding ${name}.`,
  //     new Date(),
  //   );
  // }

  return (
    <LinearGradient
      colors={['#E6EFFC', '#dbdcdc']}
      style={styles.gradientStyle}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}>
      <View style={{flex: 1, padding: 24}}>
        <SidebarLayout header={'Avaialble Spaces'} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{alignItems: 'flex-start', paddingTop: 12}}>
          <Image
            style={{padding: 0, alignSelf: 'flex-start'}}
            source={require('../images/BackBlack.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={{width: PAGE_WIDTH, height: '80%'}}>
        <WebView
          source={{uri: `${URL}/video`}}
          style={{marginTop: 20, width: '100%'}}
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
});
