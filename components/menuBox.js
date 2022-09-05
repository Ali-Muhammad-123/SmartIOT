import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const MenuBox = props => {
  return (
    <View
      style={{
        width: props.PAGE_WIDTH - 58,

        marginHorizontal: 5,
      }}>
      <View
        style={{
          backgroundColor: '#FFF',
          borderRadius: 16,
          width: '100%',
          height: (props.PAGE_WIDTH - 58) / 4 - 10,
          justifyContent: 'center',
          alignItems: 'center',

          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: props.PAGE_WIDTH / 4 - 50,
            height: props.PAGE_WIDTH / 4 - 50,
          }}
          source={props.image}
        />
      </View>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          textAlign: 'center',
          paddingTop: 5,
          color: '#000',
        }}>
        {props.title}
      </Text>
    </View>
  );
};

export default MenuBox;

const styles = StyleSheet.create({});
