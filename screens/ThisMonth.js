import React, {Component} from 'react';
import {View, StyleSheet, Text, AsyncStorage} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {wearingTime, getCurrentDate} from '../modules/utils';

const Container = styled(LinearGradient)`
  width: 100%;
  height: 100%;
`;

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

/* ==============================================================
 ThisMonth 실행
 ============================================================== */
class ThisMonth extends Component {
  render() {
    return (
      <Container colors={['white', '#e0e0e0']}>
        {/* <Text>▶ </Text> */}
        <CalendarEx />
      </Container>
    );
  }
}

/* ==============================================================
 CalendarEx : 달력 화면
 ============================================================== */
class CalendarEx extends Component {
  // CalendarEx 실행 시 연도, 월, 일, 요일 변수 생성
  constructor() {
    super();

    this.state = {
      //요일 관련 변수들
      choiceNow: 'F', //달력에서 날짜 선택 유무 판별
      choiceYear: '', //연도
      choiceMonth: '', //월
      choiceDay: '', //일
      ChoiceDayName: '', //요일

      //달력 표시를 위한 변수들
      labMarking: '', //선택 날짜 정보
      forMark: [],
      forMarkData: {},
      forMarkCheck: {marked: true},

      //저장 데이터
      useTotalPrint: '', //하루 전체 착용 시간 출력
      useRightPercent: '', //하루 전체 퍼센트 계산
      changeState: 0,
    };
  }

  //달력에서 날짜 클릭시 선택된 날짜로 데이터 변환
  updateDate = (day) => {
    console.log(day);
    this.setState({
      choiceNow: 'T',
      choiceYear: day.getFullYear(),
      choiceMonth: day.getMonth() + 1,
      choiceDay: day.getDate(),
    });
  };

  //제품을 사용한 날에 점 표시를 하기 위함.
  markDates = () => {
    for (let i = 0; i < this.state.forMark.length; i++) {
      this.state.forMarkData[this.state.forMark[i]] = {marked: true};
    }
  };

  //요일이름 업데이트
  updateDayName = (day) => {
    this.setState({
      ChoiceDayName: day,
    });
  };

  /* ============================================================================
   * 전체 사용 시간 및 잘못된 자세 시간 불러오기
   * ============================================================================ */
  async getAllTodayInf(allKey) {
    const getATI = JSON.parse(await AsyncStorage.getItem(allKey));

    if (getATI != null) {
      if (getATI.totalCount != 0) {
        console.log('getATI:', getATI);
        const total = wearingTime(getATI.totalCount);
        const right = getATI.totalRightRate + '%';

        this.setState({
          useTotalPrint: total,
          useRightPercent: right,
        });
      } else {
        this.setState({
          useTotalPrint: 0,
          useRightPercent: 0,
        });
      }
    } else {
      this.setState({
        useTotalPrint: 0,
        useRightPercent: 0,
      });
    }
  }

  addTodayInf = (key, value) => {
    AsyncStorage.setItem(JSON.stringify(key), JSON.stringify(value))
      .then(() => console.log('sucess update!!'))
      .catch((e) => console.log('e:', e));
  };

  /*=============================================================
   * 마킹을 위한 데이터 리스트 만들기
   *=============================================================*/
  async getAllKeysForMark() {
    let twin = await AsyncStorage.getAllKeys();
    let third = '';

    for (let i = 0; i < twin.length; i++) {
      third = twin[i].slice(0, 11);
      this.state.forMark[i] = third;
      this.state.forMarkData[this.state.forMark[i]] = {marked: true};
    }

    if (this.state.changeState < 5) {
      this.setState({
        changeState: this.state.changeState + 1,
      });
    } else {
      this.setState({
        changeState: 0,
      });
    }
  }

  //render
  render() {
    this.getAllKeysForMark();
    //AsyncStorage.clear()
    return (
      <View>
        <Calendar
          //날짜를 눌렀을 때 실행되는 함수
          onDayPress={(day) => {
            const choice = new Date(day.dateString);
            const choiceKey =
              choice.getFullYear() +
              '-' +
              ('0' + (choice.getMonth() + 1)).slice(-2) +
              '-' +
              ('0' + choice.getDate()).slice(-2);
            this.updateDate(choice);
            this.setState({
              labMarking:
                day.year +
                '-' +
                day.dateString.split('-')[1] +
                '-' +
                day.dateString.split('-')[2],
            });
            {
              choice.getDay() === 0
                ? this.updateDayName('Sunday')
                : choice.getDay() === 1
                ? this.updateDayName('Monday')
                : choice.getDay() === 2
                ? this.updateDayName('Tuesday')
                : choice.getDay() === 3
                ? this.updateDayName('Wednesday')
                : choice.getDay() === 4
                ? this.updateDayName('Thursday')
                : choice.getDay() === 5
                ? this.updateDayName('Friday')
                : this.updateDayName('Saturday');
            }
            this.getAllTodayInf(choiceKey);
          }}
          monthFormat={'yyyy MM'}
          onMonthChange={(month) => {
            console.log('month changed', month);
          }}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={1}
          onPressArrowLeft={(substractMonth) => substractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          markedDates={{
            ...this.state.forMarkData,

            //날짜 선택시 파란 동그라미 표시
            [this.state.labMarking]: {
              selected: true,
            },
          }}
        />
        <PressDate
          pleaseTotal={this.state.useTotalPrint}
          pleaseFail={this.state.useRightPercent}
          now={this.state.choiceNow}
          year={this.state.choiceYear}
          month={this.state.choiceMonth}
          day={this.state.choiceDay}
          dayName={this.state.ChoiceDayName}
        />
      </View>
    );
  }
}

/* ==============================================================
 CalendarEx 실행 : 달력 화면
 ============================================================== */
class PressDate extends Component {
  render() {
    if (this.props.now === 'T') {
      return (
        <View style={styles.notes}>
          <View style={styles.notes_notes}>
            <Text style={styles.notes_text}>
              {'\n총 착용 시간 : ' +
                this.props.pleaseTotal +
                '\n바른 자세 비율 : ' +
                this.props.pleaseFail}
            </Text>
          </View>
          <View style={[styles.notes_selected_date]}>
            <Text style={styles.small_text}>
              {this.props.year}/{this.props.month}
            </Text>
            <Text style={styles.big_text}>{this.props.day}</Text>
            <View style={styles.inline}>
              <Text style={styles.small_text}>{this.props.dayName}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    top: 30,
  },
  notes: {
    marginTop: 10,
    padding: 20,
    borderColor: '#F5F5F5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  notes_notes: {
    flex: 3,
  },
  notes_text: {
    fontSize: 18,
  },
  notes_selected_date: {
    flex: 1.1,
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  small_text: {
    fontSize: 15,
  },
  big_text: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  inline: {
    flexDirection: 'row',
  },
});

export default ThisMonth;

// import React, {Component} from 'react';
// import {View, StyleSheet, Text, AsyncStorage} from 'react-native';
// import {Calendar} from 'react-native-calendars';
// import {LocaleConfig} from 'react-native-calendars';
// import LinearGradient from 'react-native-linear-gradient';
// import styled from 'styled-components/native';

// const Container = styled(LinearGradient)`
//   width: 100%;
//   height: 100%;
// `;

// LocaleConfig.locales['fr'] = {
//   monthNames: [
//     'Janvier',
//     'Février',
//     'Mars',
//     'Avril',
//     'Mai',
//     'Juin',
//     'Juillet',
//     'Août',
//     'Septembre',
//     'Octobre',
//     'Novembre',
//     'Décembre',
//   ],
//   monthNamesShort: [
//     'Janv.',
//     'Févr.',
//     'Mars',
//     'Avril',
//     'Mai',
//     'Juin',
//     'Juil.',
//     'Août',
//     'Sept.',
//     'Oct.',
//     'Nov.',
//     'Déc.',
//   ],
//   dayNames: [
//     '일요일',
//     '월요일',
//     '화요일',
//     '수요일',
//     '목요일',
//     '금요일',
//     '토요일',
//   ],
//   dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
//   today: "Aujourd'hui",
// };
// LocaleConfig.defaultLocale = 'fr';

// /* ==============================================================
//  ThisMonth 실행
//  ============================================================== */
// class ThisMonth extends Component {
//   render() {
//     return (
//       <Container colors={['white', '#e0e0e0']}>
//         {/* <Text>▶ </Text> */}
//         <CalendarEx />
//       </Container>
//     );
//   }
// }

// /* ==============================================================
//  CalendarEx : 달력 화면
//  ============================================================== */
// class CalendarEx extends Component {
//   // CalendarEx 실행 시 연도, 월, 일, 요일 변수 생성
//   constructor() {
//     super();

//     this.state = {
//       //요일 관련 변수들
//       choiceNow: 'F', //달력에서 날짜 선택 유무 판별
//       choiceYear: '', //연도
//       choiceMonth: '', //월
//       choiceDay: '', //일
//       ChoiceDayName: '', //요일

//       //달력 표시를 위한 변수들
//       labMarking: '', //선택 날짜 정보
//       apple: [],
//       appleData: {},
//       appleCheck: {marked: true},

//       //저장 데이터
//       useDate: '', //날짜 저장
//       useTotal: '', //하루 전체 착용 시간
//       useWrong: '', //하루 전체 잘못된 자세 시간
//       useTotalPrint: '', //하루 전체 착용 시간 출력
//       useRightPercent: '', //하루 전체 퍼센트 계산
//       changeState: 0,
//     };
//   }
//   //달력에서 날짜 클릭시 선택된 날짜로 데이터 변환
//   updateDate = (day) => {
//     console.log(day);
//     this.setState({
//       choiceNow: 'T',
//       choiceYear: day.getFullYear(),
//       choiceMonth: day.getMonth() + 1,
//       choiceDay: day.getDate(),
//     });
//   };

//   markDates = () => {
//     for (let i = 0; i < this.state.apple.length; i++) {
//       this.state.appleData[this.state.apple[i]] = {marked: true};
//     }
//   };

//   updateDayName = (day) => {
//     this.setState({
//       ChoiceDayName: day,
//     });
//   };

//   /* ============================================================================
//    * 전체 사용 시간 및 잘못된 자세 시간 불러오기
//    * ============================================================================ */
//   async getAllTodayInf(allKey) {
//     let getATI = JSON.parse(await AsyncStorage.getItem(JSON.stringify(allKey)));
//     if (getATI != null) {
//       if (getATI == '[object Object]') {
//         if (getATI.useTotalDB != 0) {
//           console.log('getATI: ', getATI);
//           let total = getATI.useTotalDB;
//           let wrong = getATI.useWrongDB;

//           //초를 시, 분, 초 로 변환
//           let calcHour = parseInt(total / 3600);
//           let calcMinute = parseInt((total % 3600) / 60);
//           let calcSecond = (total % 3600) % 60;

//           console.log('total: ', total);
//           console.log('wrong: ', wrong);
//           console.log('calcHour: ', calcHour);
//           console.log('calcMinute: ', calcMinute);
//           console.log('calcSecond: ', calcSecond);

//           //바른자세 유지 비율 계산 (소수점 자리는 버림)
//           let calcPercent = ((total - wrong) * 100) / total;

//           console.log('calcPercent: ', calcPercent);

//           this.setState({
//             useTotalPrint:
//               calcHour + '시간 ' + calcMinute + '분 ' + calcSecond + '초',
//             useRightPercent: JSON.stringify(calcPercent).slice(0, 4) + '%',
//           });
//         } else {
//           this.setState({
//             useTotalPrint: 0,
//             useRightPercent: 0,
//           });
//         }
//       }
//     } else {
//       this.setState({
//         useTotalPrint: 0,
//         useRightPercent: 0,
//       });
//     }
//   }

//   addTodayInf = (key, value) => {
//     AsyncStorage.setItem(JSON.stringify(key), JSON.stringify(value))
//       .then(() => console.log('sucess update!!'))
//       .catch((e) => console.log('e:', e));
//   };

//   async getAllKeysApple() {
//     let twin = await AsyncStorage.getAllKeys();
//     let third = '';

//     for (let i = 0; i < twin.length; i++) {
//       third = twin[i].slice(1, 11);
//       this.state.apple[i] = third;
//       this.state.appleData[this.state.apple[i]] = {marked: true};
//     }

//     if (this.state.changeState < 5) {
//       this.setState({
//         changeState: this.state.changeState + 1,
//       });
//     } else {
//       this.setState({
//         changeState: 0,
//       });
//     }
//   }

//   //render
//   render() {
//     this.getAllKeysApple();
//     //AsyncStorage.clear()
//     return (
//       <View>
//         <Calendar
//           //날짜를 눌렀을 때 실행되는 함수
//           onDayPress={(day) => {
//             const choice = new Date(day.dateString);
//             const choiceKey =
//               choice.getFullYear() +
//               '-' +
//               ('0' + (choice.getMonth() + 1)).slice(-2) +
//               '-' +
//               ('0' + choice.getDate()).slice(-2);
//             this.updateDate(choice);
//             this.setState({
//               labMarking:
//                 day.year +
//                 '-' +
//                 day.dateString.split('-')[1] +
//                 '-' +
//                 day.dateString.split('-')[2],
//             });
//             {
//               choice.getDay() === 0
//                 ? this.updateDayName('Sunday')
//                 : choice.getDay() === 1
//                 ? this.updateDayName('Monday')
//                 : choice.getDay() === 2
//                 ? this.updateDayName('Tuesday')
//                 : choice.getDay() === 3
//                 ? this.updateDayName('Wednesday')
//                 : choice.getDay() === 4
//                 ? this.updateDayName('Thursday')
//                 : choice.getDay() === 5
//                 ? this.updateDayName('Friday')
//                 : this.updateDayName('Saturday');
//             }
//             this.addTodayInf(choiceKey, {useTotalDB: 170, useWrongDB: 10});
//             this.getAllTodayInf(choiceKey);
//           }}
//           monthFormat={'yyyy MM'}
//           onMonthChange={(month) => {
//             console.log('month changed', month);
//           }}
//           hideExtraDays={true}
//           disableMonthChange={true}
//           firstDay={1}
//           onPressArrowLeft={(substractMonth) => substractMonth()}
//           onPressArrowRight={(addMonth) => addMonth()}
//           markedDates={{
//             ...this.state.appleData,

//             //날짜 선택시 파란 동그라미 표시
//             [this.state.labMarking]: {
//               selected: true,
//             },
//           }}
//         />
//         <PressDate
//           pleaseTotal={this.state.useTotalPrint}
//           pleaseFail={this.state.useRightPercent}
//           now={this.state.choiceNow}
//           year={this.state.choiceYear}
//           month={this.state.choiceMonth}
//           day={this.state.choiceDay}
//           dayName={this.state.ChoiceDayName}
//         />
//       </View>
//     );
//   }
// }

// /* ==============================================================
//  CalendarEx 실행 : 달력 화면
//  ============================================================== */
// class PressDate extends Component {
//   render() {
//     if (this.props.now === 'T') {
//       return (
//         <View style={styles.notes}>
//           <View style={styles.notes_notes}>
//             <Text style={styles.notes_text}>
//               {'\n착용 시간 : ' +
//                 this.props.pleaseTotal +
//                 '\n바른 자세 비율 : ' +
//                 this.props.pleaseFail}
//             </Text>
//           </View>
//           <View style={[styles.notes_selected_date]}>
//             <Text style={styles.small_text}>
//               {this.props.year}/{this.props.month}
//             </Text>
//             <Text style={styles.big_text}>{this.props.day}</Text>
//             <View style={styles.inline}>
//               <Text style={styles.small_text}>{this.props.dayName}</Text>
//             </View>
//           </View>
//         </View>
//       );
//     } else {
//       return <View></View>;
//     }
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     top: 30,
//   },
//   notes: {
//     marginTop: 10,
//     padding: 20,
//     borderColor: '#F5F5F5',
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//   },
//   notes_notes: {
//     flex: 3,
//   },
//   notes_text: {
//     fontSize: 18,
//   },
//   notes_selected_date: {
//     flex: 1.1,
//     alignItems: 'flex-end',
//     flexDirection: 'column',
//   },
//   small_text: {
//     fontSize: 15,
//   },
//   big_text: {
//     fontSize: 50,
//     fontWeight: 'bold',
//   },
//   inline: {
//     flexDirection: 'row',
//   },
// });

// export default ThisMonth;
