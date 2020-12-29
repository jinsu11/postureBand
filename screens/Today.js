import React from 'react';
import styled from 'styled-components/native';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {wearingTime, getCurrentDate} from '../modules/utils';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const Container = styled(LinearGradient)`
  width: ${WIDTH};
  height: ${HEIGHT};
  padding: 5%;
`;

const Text = styled.Text`
  color: black;
  font-size: 20;
  margin-bottom: 24;
`;

const TimeContainer = styled.View`
  height: 10%;
  width: 100%;
  flex-direction: row;
`;

const TimeTextUpper = styled.Text`
  border-width: 2;
  border-bottom-width: 0;
  border-color: white;
  background-color: #283e51;
  color: white;
  font-size: 20;
  flex: 1;
  text-align: center;
  text-align-vertical: center;
`;

const TimeTextLower = styled.Text`
  border-width: 2;
  border-color: white;
  background-color: #eee;
  font-size: 20;
  flex: 1;
  text-align: center;
  text-align-vertical: center;
`;

const posture_data1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const posture_data2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const date = getCurrentDate().split('-');

const Today = () => {
  const posture_rate = useSelector((state) => state[0]?.totalRightRate);
  const wearingSeconds = useSelector((state) => state[0]?.totalCount);
  const hourlyRightRate = useSelector((state) => state[0]?.hourlyRightRate);

  for (let hour in hourlyRightRate) {
    const parsedHour = parseInt(hour);
    if (parsedHour === 0) {
      posture_data2[11] = hourlyRightRate[hour];
    } else if (parsedHour <= 12) {
      posture_data1[parsedHour - 1] = hourlyRightRate[hour];
    } else if (parsedHour <= 24) {
      posture_data2[parsedHour - 13] = hourlyRightRate[hour];
    }
  }

  return (
    <Container colors={['white', '#e0e0e0']}>
      <Text style={{marginBottom: 24, fontSize: 24}}>
        {date[0]}년 {date[1]}월 {date[2]}일
      </Text>
      <TimeContainer>
        <TimeTextUpper style={{borderRightWidth: 0, borderTopLeftRadius: 12}}>
          총 착용 시간
        </TimeTextUpper>
        <TimeTextUpper style={{borderTopRightRadius: 12}}>
          바른 자세 유지 비율
        </TimeTextUpper>
      </TimeContainer>
      <TimeContainer>
        <TimeTextLower
          style={{borderRightWidth: 0, borderBottomLeftRadius: 12}}>
          {wearingSeconds !== undefined ? wearingTime(wearingSeconds) : '0초'}
        </TimeTextLower>
        <TimeTextLower style={{borderBottomRightRadius: 12}}>
          {posture_rate !== undefined ? posture_rate : 0}%
        </TimeTextLower>
      </TimeContainer>
      <Text style={{marginTop: 24}}>
        {/* ★ 총 착용 시간 -> {wearingTime(wearingSeconds)} */}
      </Text>
      {/* <Text>★ 바른 자세 유지 비율 -> {posture_rate}%</Text> */}
      <ScrollView horizontal>
        <LineChart
          data={{
            labels: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
            ],
            datasets: [
              {
                data: posture_data1,
              },
            ],
          }}
          width={WIDTH * 0.9} // from react-native
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: '#4B79A1',
            backgroundGradientTo: '#283E51',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '3',
              stroke: '#666',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
          }}
        />
        <LineChart
          data={{
            labels: [
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
              '21',
              '22',
              '23',
              '24',
            ],
            datasets: [
              {
                data: posture_data2,
              },
            ],
          }}
          width={WIDTH * 0.9} // from react-native
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: '#4B79A1',
            backgroundGradientTo: '#283E51',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '3',
              stroke: '#666',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
          }}
        />
      </ScrollView>
    </Container>
  );
};

export default Today;
