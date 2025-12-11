import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

export const initializeStorage = async () => {
  try {
    // Initialize storage with default values if needed
    const offlineReports = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_REPORTS);
    if (!offlineReports) {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_REPORTS, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
};

export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Save data error:', error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Get data error:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Remove data error:', error);
    return false;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Clear data error:', error);
    return false;
  }
};

// Offline Reports Management
export const saveOfflineReport = async (report) => {
  try {
    const offlineReports = await getData(STORAGE_KEYS.OFFLINE_REPORTS) || [];
    offlineReports.push({
      ...report,
      id: `offline_${Date.now()}`,
      offline: true,
      createdAt: new Date().toISOString(),
    });
    await saveData(STORAGE_KEYS.OFFLINE_REPORTS, offlineReports);
    return true;
  } catch (error) {
    console.error('Save offline report error:', error);
    return false;
  }
};

export const getOfflineReports = async () => {
  try {
    return await getData(STORAGE_KEYS.OFFLINE_REPORTS) || [];
  } catch (error) {
    console.error('Get offline reports error:', error);
    return [];
  }
};

export const removeOfflineReport = async (reportId) => {
  try {
    const offlineReports = await getData(STORAGE_KEYS.OFFLINE_REPORTS) || [];
    const filtered = offlineReports.filter(report => report.id !== reportId);
    await saveData(STORAGE_KEYS.OFFLINE_REPORTS, filtered);
    return true;
  } catch (error) {
    console.error('Remove offline report error:', error);
    return false;
  }
};

export const clearOfflineReports = async () => {
  try {
    await saveData(STORAGE_KEYS.OFFLINE_REPORTS, []);
    return true;
  } catch (error) {
    console.error('Clear offline reports error:', error);
    return false;
  }
};
