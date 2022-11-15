import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CustomStackParamList } from 'types/navigationTypes';
import AllScreens from 'navigations/AllScreens';

interface DefaultProps {
  mainScreen: 'Home' | 'Market' | 'Community' | 'Talk' | 'Property';
}

const NavigationScreens = ({ mainScreen }: DefaultProps) => {
  const Stack = createStackNavigator<CustomStackParamList>();

  const getMainScreen = () => {
    switch (mainScreen) {
      case 'Home':
        return (
          <Stack.Screen
            options={{ headerShown: true }}
            name={'HomeMainScreen'}
            component={AllScreens.HomeMainScreen}
          />
        );
      default:
        break;
    }
  };

  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        headerTitle: '',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {getMainScreen()}
      <Stack.Screen name="HomeSubScreen" component={AllScreens.HomeSubScreen} />
    </Stack.Navigator>
  );
};

export default NavigationScreens;
