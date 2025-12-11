import React, { createContext, useState, useContext, useEffect } from 'react';
import * as NetInfo from '@react-native-community/netinfo';
import { 
  getOfflineReports, 
  saveOfflineReport, 
  removeOfflineReport 
} from '../services/storageService';
import { submitReport } from '../services/apiService';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineReports, setOfflineReports] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      
      // Auto-sync when coming back online
      if (state.isConnected && offlineReports.length > 0) {
        syncOfflineReports();
      }
    });

    // Load offline reports on mount
    loadOfflineReports();

    return () => unsubscribe();
  }, []);

  const loadOfflineReports = async () => {
    try {
      const reports = await getOfflineReports();
      setOfflineReports(reports);
    } catch (error) {
      console.error('Load offline reports error:', error);
    }
  };

  const addOfflineReport = async (report) => {
    try {
      await saveOfflineReport(report);
      await loadOfflineReports();
      return true;
    } catch (error) {
      console.error('Add offline report error:', error);
      return false;
    }
  };

  const syncOfflineReports = async () => {
    if (syncing || offlineReports.length === 0) return;

    setSyncing(true);
    const successfulSyncs = [];

    try {
      for (const report of offlineReports) {
        try {
          const result = await submitReport(report);
          if (result.success) {
            successfulSyncs.push(report.id);
          }
        } catch (error) {
          console.error(`Failed to sync report ${report.id}:`, error);
        }
      }

      // Remove successfully synced reports
      for (const reportId of successfulSyncs) {
        await removeOfflineReport(reportId);
      }

      await loadOfflineReports();
      return {
        success: true,
        synced: successfulSyncs.length,
        total: offlineReports.length,
      };
    } catch (error) {
      console.error('Sync error:', error);
      return { success: false, error: 'Sync failed' };
    } finally {
      setSyncing(false);
    }
  };

  const value = {
    isOnline,
    offlineReports,
    syncing,
    addOfflineReport,
    syncOfflineReports,
    loadOfflineReports,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
