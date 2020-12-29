import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import {Text} from 'react-native';

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
`;

const Title = styled.Text`
  font-size: 30;
`;

const BatteryContainer = styled.View`
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 2%;
  top: 3%;
`;

export const show_battery = (rest_battery) => {
  let iconName = 'battery';
  let color;
  if (rest_battery > 80) {
    color = 'green';
  } else if (rest_battery > 60) {
    color = 'green';
    iconName += '-80';
  } else if (rest_battery > 40) {
    color = 'yellow';
    iconName += '-60';
  } else if (rest_battery > 20) {
    color = 'red';
    iconName += '-40';
  } else if (rest_battery <= 20) {
    color = 'red';
    iconName += '-20';
  }

  return (
    <Container>
      <Title>Posture</Title>
      <BatteryContainer>
        <Icon name={iconName} size={30} color={color} />
        <Text>battery</Text>
      </BatteryContainer>
    </Container>
  );
};
