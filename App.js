import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
// ...
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoarding from './pages/onBoarding';
import SignIn from './pages/signIn';
import Register from './pages/register';
import OtpScreen from './pages/otpScreen';
import UpdateEmail from './pages/updateEmail';
import UpdatePhone from './pages/updatePhone';
import UpdatePassword from './pages/updatePassword';
import Home from './pages/home';
import MyAccount from './pages/myAccount';
import Contact from './pages/contact';
import Reservations from './pages/reservations';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {configureStore} from '@reduxjs/toolkit';
import sidebarReducer from './reducers/sidebar';
import {Provider, useSelector} from 'react-redux';
import MyTabBar from './components/tabBar';

import LiveStream from './pages/LiveStream';
import AvailableSlots from './pages/availableSlots';
import BookSlot from './pages/bookSlot';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    SplashScreen.show();

    func = async () => {
      const id = await AsyncStorage.getItem('@id');
      if (id !== null) {
        console.log('helloo');

        setLoggedIn(true);
      } else {
        console.log('null ID');
        setLoggedIn(false);
      }

      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    };
    func();
  }, []);

  function HomeStack({route, navigation}) {
    const {shouldRedirect} = route.params;
    useEffect(() => {
      shouldRedirect === true ? navigation.navigate('OnBoarding1') : '';
    }, [shouldRedirect]);

    return (
      <Tab.Navigator
        tabBar={props => <MyTabBar {...props} />}
        screenOptions={({route}) => ({
          unmountOnBlur: true,
          headerShown: false,
        })}>
        <Tab.Screen
          options={{
            tabBarIcon: focused => {
              return (
                <Image
                  resizeMode={'contain'}
                  source={
                    focused
                      ? require('./images/home2.png')
                      : require('./images/homegrey.png')
                  }
                  style={{width: 20, height: 20}}
                />
              );
            },
            tabBarShowLabel: true,
          }}
          name="Home"
          component={Home}
        />
        <Tab.Screen
          options={{
            tabBarIcon: focused => {
              return (
                <Image
                  resizeMode={'contain'}
                  source={
                    focused
                      ? require('./images/envelope.png')
                      : require('./images/envelopegrey.png')
                  }
                  style={{width: 20, height: 20}}
                />
              );
            },
            // tabBarShowLabel: false,
          }}
          name="Contact"
          component={Contact}
        />
        <Tab.Screen
          options={{
            tabBarIcon: focused => {
              return (
                <Image
                  resizeMode={'contain'}
                  source={
                    focused
                      ? require('./images/account.png')
                      : require('./images/accountGrey.png')
                  }
                  style={{width: 20, height: 20}}
                />
              );
            },
            // tabBarShowLabel: false,
          }}
          name="Profile"
          component={MyAccount}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen
                name="HomeStack"
                component={HomeStack}
                initialParams={{shouldRedirect: !loggedIn}}
              />
              <Stack.Screen name="OnBoarding1" component={OnBoarding} />
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="UpdatePhone" component={UpdatePhone} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="UpdateEmail" component={UpdateEmail} />
              <Stack.Screen name="OtpScreen" component={OtpScreen} />
              <Stack.Screen name="LiveStream" component={LiveStream} />
              <Stack.Screen name="AvailableSlots" component={AvailableSlots} />
              <Stack.Screen name="Reservations" component={Reservations} />
              <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
              <Stack.Screen name="BookSlot" component={BookSlot} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
