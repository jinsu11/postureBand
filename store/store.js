import React from 'react';
import {saveNewData, mergeData} from '../modules/handleData';
import {getCurrentDate, checkPosture} from '../modules/utils';
export const CONNECTING = 'CONNECTING';
export const CONNECTED = 'CONNECTED';
export const SAVE_DATA = 'SAVE_DATA';

export const rootReducer = (state = [], action) => {
  switch (action.type) {
    case CONNECTING:
      return [{info: action.info, type: CONNECTING}];
    case CONNECTED: // 블루투스에 연결될 경우 연결상태를 나타내던 state 초기화 후 현재 시간 저장
      const savedData = action.savedData;
      console.log('savedData:', savedData);
      if (savedData !== null) {
        return [savedData];
      } else {
        const date = getCurrentDate();
        const newData = {
          date,
          totalCount: 0, // 전체 카운드 수 (1초마다 1씩 증가)
          totalRightCount: 0, // 올바른 자세 카운트
          totalRightRate: 85, // 바른 자세 비율(처음에 오늘의 목표 아이콘은 "체크안됨"으로 하기위해 85로 설정)
          currentCount: 0, // 현재 카운트 수(시간별로 바른 자세 비율 저장하는데 사용됨)
          currentRightCount: 0, // 현재 바른 자세 카운트(시간별로 바른 자세 비율 저장하는데 사용됨)
          hourlyRightRate: {}, // 시간별 바른 자세 비율 hourlyRightRate: {"9":97.2, "13":89.5} 와 같은 형식으로 데이터 저장
          currentRoll: 0,
          currentPitch: 0,
        };
        console.log('newData:', newData);
        saveNewData(newData);
        return [newData];
      }
    case SAVE_DATA:
      const newState = checkPosture(action.pitch, action.roll, state[0]); // 바른 자세 측정하여 저장
      mergeData(newState);
      return [newState];
    default:
      return state;
  }
};

export const actionCreator = {
  sendConnectingInfo: (info) => ({type: CONNECTING, info}),
  sendConnected: (savedData) => ({type: CONNECTED, savedData}),
  saveData: (pitch, roll) => ({type: SAVE_DATA, pitch, roll}),
};
