import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { OfflineProvider } from './src/contexts/OfflineContext';
import MainNavigator from './src/navigation/MainNavigator';
import { initializeStorage } from './src/services/storageService';
import { setupNotificationListener, setupNotificationResponseListener } from './src/services/notificationService';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useRef();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    async function prepare() {
      try {
        await initializeStorage();
      } catch (e) {
        console.warn('Storage initialization failed:', e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    // Set up notification listeners
    notificationListener.current = setupNotificationListener((notification) => {
      console.log('Notification received in foreground:', notification);
    });

    responseListener.current = setupNotificationResponseListener((response) => {
      console.log('Notification tapped:', response);
      
      // Navigate to report details if notification contains reportId
      const reportId = response.notification.request.content.data?.reportId;
      if (reportId && navigationRef.current) {
        navigationRef.current.navigate('ReportDetails', { id: reportId });
      }
    });

    // Clean up listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current();
      }
      if (responseListener.current) {
        responseListener.current();
      }
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <OfflineProvider>
          <MainNavigator />
          <StatusBar style="auto" />
        </OfflineProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
