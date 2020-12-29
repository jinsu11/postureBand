import React, {Component, useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import Entypo from 'react-native-vector-icons/Entypo';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const Container = styled(LinearGradient)`
  width: ${WIDTH};
  height: ${HEIGHT};
  padding: 0 5%;
`;

const styles = StyleSheet.create({
  head: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },

  title: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },

  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },

  small_date: {
    marginVertical: 10,
    fontSize: 15,
  },

  body: {
    fontSize: 20,
  },
});

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const date = now.getDate();
const day = now.getDay();

const getLastDayOfLastMonth = (year, month) => {
  return month === 0
    ? new Date(year - 1, 12, 0).getDate()
    : new Date(year, month, 0).getDate();
}; // 지난달의 마지막 날짜를  반환합니다

let weeklyData = [
  [2, 2, 3, 2, 2, 2, 1.5],
  [0.5, 0.4, 0.8, 0.5, 0.4, 0.3, 0.3],
]; // [0]: in Wearing [1]:in Wrong posture
let sum_Wearing = 0;
let sum_WrongPosture = 0;
for (let i = 0; i < 7; i++) {
  sum_Wearing += weeklyData[0][i];
  sum_WrongPosture += weeklyData[1][i];
}

const ThisWeek = () => {
  console.log('Entered in ThisWeek.js!!!!!!!');
  const [currentDate, setCurrentDate] = useState({
    year,
    month,
    date,
    day,
  });

  const moveToLastWeek = () => {
    const date = currentDate.date;
    const month = currentDate.month;
    const year = currentDate.year;
    let year0 = date - 7 < 1 && month - 1 < 0 ? year - 1 : year;
    let month0 = date - 7 < 1 ? (month - 1 < 0 ? 11 : month - 1) : month;
    let date0 =
      date - 7 < 1 ? getLastDayOfLastMonth(year, month) + date - 7 : date - 7;
    return [year0, month0, date0];
  }; // 지난주의 날짜 정보를 반환합니다

  const moveToNextWeek = () => {
    const date = currentDate.date;
    const month = currentDate.month;
    const year = currentDate.year;
    let lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    let year0 = date + 7 > lastDayOfMonth && month === 11 ? year + 1 : year;
    let month0 =
      date + 7 > lastDayOfMonth ? (month + 1 > 11 ? 0 : month + 1) : month;
    let date0 =
      date + 7 > lastDayOfMonth ? date + 7 - lastDayOfMonth : date + 7;
    return [year0, month0, date0];
  }; // 다음주의 날짜 정보를 반환합니다

  const setTitleText = () => {
    const date = currentDate.date;
    const month = currentDate.month;
    const year = currentDate.year;
    const day = new Date(year, month, date).getDay();
    const LastDayOfWeek = new Date(year, month, date - day + 6);
    if (LastDayOfWeek.getMonth() != 0 || LastDayOfWeek.getDate() - 6 > 0)
      return LastDayOfWeek.getDate() - 6 > 0
        ? LastDayOfWeek.getFullYear() +
            '년 ' +
            (LastDayOfWeek.getMonth() + 1) +
            '월'
        : LastDayOfWeek.getFullYear() +
            '년 ' +
            LastDayOfWeek.getMonth() +
            '~' +
            (LastDayOfWeek.getMonth() + 1) +
            '월';
    else
      return (
        LastDayOfWeek.getFullYear() -
        1 +
        '년 12월~' +
        LastDayOfWeek.getFullYear() +
        '년 1월'
      );
  }; // 차트의 제목을 반환합니다(yyyy년 M월)

  const setWeekDates = () => {
    const date = currentDate.date;
    const month = currentDate.month;
    const year = currentDate.year;
    const day = new Date(year, month, date).getDay();
    const LastDayOfWeek = new Date(year, month, date - day + 6);
    let weekDates = [];
    for (let i = 0; i < 7; i++) {
      // set weekDates
      let dates = LastDayOfWeek.getDate() - 6 + i;
      weekDates.push(
        dates > 0
          ? dates
          : getLastDayOfLastMonth(
              LastDayOfWeek.getFullYear(),
              LastDayOfWeek.getMonth(),
            ) + dates,
      );
    }
    return weekDates;
  }; // 차트에 나타낼 주간을 반환합니다

  return (
    <Container colors={['white', '#e0e0e0']}>
      <View style={styles.head}>
        <TouchableOpacity
          onPress={() => {
            const changed_date = moveToLastWeek();
            setCurrentDate({
              year: changed_date[0],
              month: changed_date[1],
              date: changed_date[2],
            });
            console.log(currentDate.year, currentDate.month, currentDate.date);
          }}>
          <Entypo name="chevron-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{setTitleText()}</Text>
        <TouchableOpacity
          onPress={() => {
            const changed_date = moveToNextWeek();
            setCurrentDate({
              year: changed_date[0],
              month: changed_date[1],
              date: changed_date[2],
            });
            console.log(currentDate.year, currentDate.month, currentDate.date);
          }}>
          <Entypo name="chevron-right" size={24} />
        </TouchableOpacity>
      </View>
      <BarChart
        data={{
          labels: setWeekDates(),
          datasets: [
            {
              data: weeklyData[1],
            },
          ],
        }}
        width={WIDTH * 0.9} // from react-native
        height={220}
        xAxisLabel={'일'}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#4c79a2',
          backgroundGradientTo: '#283f51',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        fromZero
        style={styles.chart}
      />
      <Text>
        {currentDate.year +
          '-' +
          (currentDate.month + 1) +
          '-' +
          currentDate.date}
      </Text>
      <Text style={styles.body}>
        착용 시간 : {sum_Wearing}시간
        {'\n'}
        바른 자세 비율 :{Math.round((1 - sum_WrongPosture / sum_Wearing) * 100)}
        %
      </Text>
    </Container>
  );
};

export default ThisWeek;
