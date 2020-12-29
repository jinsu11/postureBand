import React, {useEffect} from 'react';
import RootContainer from './RootContainer';
import {Provider} from 'react-redux';
import {rootReducer} from './store/store';
import {createStore} from 'redux';
import requestLocationPermission from './modules/Permission';
import connectBluetooth from './modules/Bluetooth';

function App() {
  const store = createStore(rootReducer);
  requestLocationPermission(); // BLE 사용을 위해서는 위치정보가 필요함\

  useEffect(() => {
    connectBluetooth(store.dispatch); // 블루투스 연결
  }, []);

  return (
    <Provider store={store}>
      <RootContainer />
    </Provider>
  );
}

export default App;
