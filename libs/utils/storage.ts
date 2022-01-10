import AsyncStorage from '@react-native-async-storage/async-storage';
import {isJsonString} from './misc';

const Storage = {
  async get(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        const isValid = isJsonString(value);
        if (isValid) {
          return JSON.parse(value);
        } else {
          return value;
        }
      } else {
        return null;
      }
    } catch (e) {
      console.warn(e);
    }
  },
  async getMultiple(keys: string[]) {
    let result: any = {};
    try {
      const values = await AsyncStorage.multiGet(keys);
      if (Array.isArray(values)) {
        values.forEach(item => {
          let key = item[0];
          let value = item[1];
          if (value) {
            const isValid = isJsonString(value);
            if (isValid) {
              return JSON.parse(value);
            } else {
              return value;
            }
          }
          result[key] = value;
        });
      }
      keys.forEach(key => {
        if (Object.keys(result).indexOf(key) === -1) {
          result[key] = null;
        }
      });
    } catch (e) {
      console.warn(e);
    }
  },
  async set(key: string, value: any) {
    try {
      let nvalue = value;
      if (typeof nvalue === 'object') {
        nvalue = JSON.stringify(nvalue);
      }
      await AsyncStorage.setItem(key, nvalue);
    } catch (e) {
      console.warn(e);
    }
  },
  async merge(key: string, value: any) {
    try {
      let nvalue = value;
      if (typeof nvalue === 'object') {
        nvalue = JSON.stringify(nvalue);
      }
      await AsyncStorage.mergeItem(key, value);
    } catch (e) {
      console.warn(e);
    }
  },
  async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(e);
    }
  },
  async removeItems(key: string[]) {
    try {
      await AsyncStorage.multiRemove(key);
    } catch (e) {
      console.warn(e);
    }
  },
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn(e);
    }
  },
  async getAllKeys() {
    try {
      const keys = await AsyncStorage.clear();
      if (Array.isArray(keys)) {
        return keys;
      } else {
        return [];
      }
    } catch (e) {
      console.warn(e);
    }
  },
};

export default Storage;
