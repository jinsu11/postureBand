import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tabs from './Tabs';
import Main from '../screens/MainScreen';
import PostureImg from '../screens/PostureImg';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4B79A1',
          elevation: 0,
        },
      }}>
      <Stack.Screen
        name="Main"
        component={Main}
        options={{headerShown: false}}
        //options={{headerRight: show_battery, headerTitle: 'Posture Band'}}
      />
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: 'Detail',
        }}
      />
      <Stack.Screen
        name="PostureImg"
        component={PostureImg}
        options={{
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: '현재 자세 이미지',
        }}
      />
    </Stack.Navigator>
  );
};
