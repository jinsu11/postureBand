import React from 'react';
import styled from 'styled-components/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Today from '../screens/Today';
import ThisWeek from '../screens/ThisWeek';
import ThisMonth from '../screens/ThisMonth';
import {Text, StatusBar} from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#4B79A1" />
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarLabel: ({focused}) => {
          return (
            <Text
              style={{
                color: focused ? '#333333' : '#EEEEEE',
                fontSize: 18,
                fontWeight: focused ? 'bold' : '500',
              }}>
              {route.name}
            </Text>
          );
        },
      })}
      swipeEnabled={false}
      tabBarOptions={{
        indicatorStyle: {backgroundColor: 'green'},
        tabStyle: {backgroundColor: '#4B79A1'},
      }}>
      <Tab.Screen name="오늘" component={Today} />
      <Tab.Screen name="이번주" component={ThisWeek} />
      <Tab.Screen name="이번달" component={ThisMonth} />
    </Tab.Navigator>
  </>
);
