import React from 'react';
import {View, StatusBar, Text, Button, Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Stack from './navigation/Stack';

const {width: WIDTH, height: HEIGHT} = Dimensions.get('screen');

const RootContainer = () => {
  return (
    <View style={{width: WIDTH, height: HEIGHT}}>
      <StatusBar barStyle="dark-content" backgroundColor="#DDEFFF" />
      <NavigationContainer>
        <Stack />
      </NavigationContainer>
    </View>
  );
};

export default RootContainer;
