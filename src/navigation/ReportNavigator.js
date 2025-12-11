import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../utils/constants';
import NewReportScreen from '../screens/NewReportScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';

const Stack = createStackNavigator();

const ReportNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="NewReport"
        component={NewReportScreen}
        options={{
          title: 'New Report',
        }}
      />
      <Stack.Screen
        name="ReportDetails"
        component={ReportDetailsScreen}
        options={{
          title: 'Report Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default ReportNavigator;
