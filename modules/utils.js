import {CONNECTING} from '../store/store';

export const checkPosture = (pitch, roll, state) => {
  const date = new Date();
  const newState = {...state};
  let currentHourRate = newState.hourlyRightRate[`${date.getHours()}`];
  console.log('currentHourRate:', currentHourRate);
  if (currentHourRate === undefined) {
    newState.currentCount = 0;
    newState.currentRightCount = 0;
  }
  newState.totalCount++;
  newState.currentCount++;

  if (Math.abs(roll) < 15 && Math.abs(pitch) < 15) {
    newState.totalRightCount++;
    newState.currentRightCount++;
  }

  newState.totalRightRate =
    Math.floor((newState.totalRightCount / newState.totalCount) * 1000) / 10; // 바른자세 비율을 소수점 첫째자리 까지 계산
  newState.hourlyRightRate[`${date.getHours()}`] =
    Math.floor((newState.currentRightCount / newState.currentCount) * 1000) /
    10;

  newState.currentPitch = pitch;
  newState.currentRoll = roll;

  return newState;
};

export const getCurrentDate = () => {
  const getZero = (value) => ('0' + value).slice(-2);
  const date = new Date();
  return `${date.getFullYear()}-${getZero(date.getMonth() + 1)}-${getZero(
    date.getDate(),
  )}`;
};

/*==========================================================================================
시간을 받아서 시,분,초로 나타내는 함수 & state를 받아서 주간, 월간 착용 시간을 반환하는 함수
screens/MainScreen.js에서 사용
============================================================================================*/

export const wearingTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (seconds > 3600) {
    return `${hours}시간 ${minutes}분`;
  } else if (seconds > 60) {
    return `${minutes}분`;
  } else {
    return `${seconds}초`;
  }
};

export const weeklyWearingTime = (state) => {
  if (state.length === 0 || state[0]?.type === CONNECTING) {
    return '';
  }

  let weeklyTime = 0;
  const today = new Date();

  for (let i = 0; i < state.length; i++) {
    const date = state[i]?.date.split('-');
    if (
      parseInt(date[1]) === today.getMonth() + 1 &&
      parseInt(date[2]) >= 1 &&
      parseInt(date[2]) <= 5
    ) {
      // 날짜에 맞게 계산 예정\
      weeklyTime = weeklyTime + state[i].totalCount;
    }
  }
  return wearingTime(weeklyTime);
};

export const monthlyWearingTime = (state) => {
  if (state.length === 0 || state[0]?.type === CONNECTING) {
    return '';
  }

  const today = new Date();
  let monthlyTime = 0;
  for (let i = 0; i < state.length; i++) {
    const date = state[i]?.date.split('-');
    if (parseInt(date[1]) === today.getMonth() + 1) {
      // 날짜에 맞게 계산 예정
      monthlyTime = monthlyTime + state[i].totalCount;
    }
  }
  return wearingTime(monthlyTime);
};
