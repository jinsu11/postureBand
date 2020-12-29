import React from 'react';
import {Platform} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {actionCreator} from '../store/store';
import {Buffer} from 'buffer';
import {loadDataOfToday} from './handleData';

const manager = new BleManager();

const scanAndConnect = (dispatch) => {
  manager.startDeviceScan(null, null, (error, device) => {
    // 장치 스캔 시작
    dispatch(actionCreator.sendConnectingInfo('블루투스 스캔중...'));
    console.log('Scanning...');
    if (error) {
      console.log(`ERROR1: ${error}`);
      dispatch(actionCreator.sendConnectingInfo('Restart the app'));
      return;
    }

    if (device.name === 'HMSoft' || device.name === 'HM-10') {
      // 장치를 찾았을 경우
      dispatch(actionCreator.sendConnectingInfo('블루투스 연결중...'));
      manager.stopDeviceScan(); // 장치 스캔 종료
      device
        .connect()
        .then((device) => {
          // 장치에 연결 후 services와 characteristics 검색
          dispatch(actionCreator.sendConnectingInfo('블루투스 정보 찾는중...'));
          return device.discoverAllServicesAndCharacteristics();
        })
        .then((device) => {
          return device.monitorCharacteristicForService(
            // 데이터를 수신했을때 동작 설정
            '0000ffe0-0000-1000-8000-00805f9b34fb', // 블루투스(HM-10)의 Service UUID
            '0000ffe1-0000-1000-8000-00805f9b34fb', // 블루투스(HM-10)의 Characteristic UUID
            (error, characeristic) => {
              if (error) {
                console.log('error:', error);
                dispatch(actionCreator.sendConnectingInfo('연결 끊김'));
                return;
              }
              const receivedData = new Buffer(
                characeristic.value,
                'base64',
              ).toString('ascii'); // 데이터가 base64 형태로 수신되기 때문에 askii 값으로 변경
              const pitchAndRoll = receivedData.split(','); // pitch,roll (ex, 3,-1)의 형식으로 오는 데이터를 ','를 기준으로 분리하여 저장
              console.log(pitchAndRoll);
              dispatch(
                actionCreator.saveData(
                  parseInt(pitchAndRoll[0]),
                  parseInt(pitchAndRoll[1]),
                ),
              ); // 자세 틀어짐 값인 roll(앞뒤), pitch(양옆)을 state로 dispatch함
            },
          );
        })
        .then(
          () => {
            console.log('connected');
            loadDataOfToday().then((data) => {
              dispatch(actionCreator.sendConnected(data));
            });
            dispatch(actionCreator.sendConnectingInfo('연결됨!'));
          },
          (error) => {
            console.log(`ERROR2: ${error.message}`);
            dispatch(actionCreator.sendConnectingInfo('앱을 다시 시작하세요!'));
          },
        );
    }
  });
};

function connectBluetooth(dispatch) {
  // react-native-blx-plx 모듈로부터 가져온 BleManager Object 사용
  if (Platform.OS === 'ios') {
    manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndConnect();
      }
    });
  } else {
    scanAndConnect(dispatch);
  }
}

export default connectBluetooth;
