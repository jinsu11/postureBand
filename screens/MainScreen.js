import React from 'react';
import styled from 'styled-components/native';
import {Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {show_battery} from '../modules/battery';
import {useSelector} from 'react-redux';
import {
  wearingTime,
  weeklyWearingTime,
  monthlyWearingTime,
} from '../modules/utils';

const Title = styled.Text`
  margin-bottom: 2%;
`;

const Container = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  padding: 5%;
`;

const CheckContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const GoalContainer = styled.View`
  width: 90%;
  height: 15%;
  border-radius: 5px;
  border-width: 4px;
  border-color: #rgba(75, 121, 161, 0.6);
  background-color: #f8f8f8;
  padding: 10px;
  margin-bottom: 5%;
`;

const RecordContainer1 = styled.View`
  width: 70%;
  height: 15%;
  border-radius: 5px;
  border-width: 4px;
  border-color: #rgba(75, 121, 161, 0.6);
  background-color: #f8f8f8;
  padding: 10px;
  margin-bottom: 5%;
`;

const RecordContainer2 = styled.View`
  width: 95%;
  height: 100%;
  border-radius: 5px;
  border-width: 4px;
  border-color: #rgba(75, 121, 161, 0.6);
  background-color: #f8f8f8;
  padding: 10px;
`;

const PictureContainer = styled.View`
  width: 95%;
  height: 100%;
  border-radius: 5px;
  border-width: 4px;
  border-color: #rgba(75, 121, 161, 0.6);
  background-color: #f8f8f8;
  padding: 10px;
`;

const ConnectionContainer = styled.View`
  width: 50%;
  height: 6%;
  border-radius: 5px;
  border-width: 4px;
  border-color: #rgba(75, 121, 161, 0.6);
  background-color: #f8f8f8;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const DetailText = styled.Text`
  font-size: 13;
  font-weight: bold;
  text-align: right;
  text-align-vertical: bottom;
  flex: 1;
  margin-right: 10;
  margin-bottom: 5;
`;

export default ({navigation}) => {
  const state = useSelector((state) => state);
  const connectionState = state[0]?.info;
  const rightRate = state[0]?.totalRightRate;
  const wearingSeconds = state[0]?.totalCount;

  console.log('state:', state);
  const missions = {
    mission1: {
      iconName: (seconds) =>
        seconds >= 30 ? 'checkbox-marked' : 'checkbox-blank-outline',
      color: (seconds) => (seconds >= 30 ? '#5CC05C' : '#333333'),
    },
    mission2: {
      iconName: (rate) =>
        rate >= 90
          ? 'checkbox-marked'
          : rate < 80
          ? 'close-box'
          : 'checkbox-blank-outline',
      color: (rate) =>
        rate >= 90 ? '#5CC05C' : rate < 80 ? '#B50000' : '#333333',
    },
  };
  return (
    <Container colors={['#DDF0FF', '#CFDEF3']}>
      {show_battery(78)}
      <Title>▶ 오늘의 목표</Title>
      <GoalContainer>
        <CheckContainer>
          <Icon
            name={missions.mission1.iconName(wearingSeconds)}
            size={20}
            color={missions.mission1.color(wearingSeconds)}
          />
          <Text> 30초 동안 착용하기</Text>
        </CheckContainer>
        <CheckContainer>
          <Icon
            name={missions.mission2.iconName(rightRate)}
            size={20}
            color={missions.mission2.color(rightRate)}
          />
          <Text> 바른 자세 90% 이상 유지하기</Text>
        </CheckContainer>
      </GoalContainer>
      <Title>▶ 오늘 자세 기록</Title>
      <RecordContainer1>
        <Text>
          착용 시간:{' '}
          {wearingSeconds === undefined ? '0초' : wearingTime(wearingSeconds)}
        </Text>
        <Text>바른 자세 유지 비율: {rightRate || '0'}%</Text>
      </RecordContainer1>
      <Title>▶ 세부 자세 기록</Title>
      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs')}
        style={{height: '15%', marginBottom: '5%'}}>
        <RecordContainer2>
          <Text>이번주 착용 시간: {weeklyWearingTime(state)}</Text>
          <Text>이번달 착용 시간: {monthlyWearingTime(state)}</Text>
          <Text>...</Text>
          <DetailText>Go to detail</DetailText>
        </RecordContainer2>
      </TouchableOpacity>
      <Title>▶ 오늘의 신체 균형 분석 기록</Title>
      <TouchableOpacity
        onPress={() => navigation.navigate('PostureImg')}
        style={{height: '15%', marginBottom: '5%'}}>
        <PictureContainer>
          <Text>신체 균형: 앞쪽으로 약 3% 기울었음</Text>
          <Text>위험 지수: 정상</Text>
          <Text>...</Text>
          <DetailText>Go to detail</DetailText>
        </PictureContainer>
      </TouchableOpacity>
      <ConnectionContainer>
        <Text>{connectionState || '연결됨'}</Text>
      </ConnectionContainer>
    </Container>
  );
};
