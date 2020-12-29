import {PermissionsAndroid, Platform} from 'react-native';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      Platform.Version >= 29
        ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION // 플랫폼 버전 29이상일 경우 ACCESS_FINE_LOCATION 요청
        : PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, // 플랫폼 버전 29미만일 경우 ACCESS_COARSE_LOCATION 요청
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default requestLocationPermission;
