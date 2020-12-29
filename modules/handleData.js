import {AsyncStorage} from 'react-native';
import {getCurrentDate} from './utils';

export const loadDataOfToday = async () => {
  const date = getCurrentDate();
  try {
    const value = await AsyncStorage.getItem(date);
    return JSON.parse(value);
  } catch (error) {
    console.log(error);
  }
};

export const saveNewData = async (data) => {
  try {
    await AsyncStorage.setItem(data.date, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export const mergeData = async (data) => {
  try {
    await AsyncStorage.mergeItem(data.date, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export const loadRightRateData = async (date) => {
  try {
    const value = await AsyncStorage.getItem(date);
    if (value === null) {
      return 0;
    } else {
      return JSON.parse(value).totalRightRate;
    }
  } catch (error) {
    console.log(error);
  }
};

export const loadAllData = async () => {
  try {
    const value = await AsyncStorage.getAllKeys();
    console.log('value:', value);
    return value;
  } catch (error) {
    console.log(error);
  }
};
