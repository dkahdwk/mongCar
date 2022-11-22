import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import HomeNavigation from 'navigations/HomeNavigation';
import styled from 'styled-components/native';

const NavController = observer(() => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const { commonStore } = useStore();

  return (
    <NavigationContainer>
      <Tab.Navigator
        backBehavior={'none'}
        initialRouteName={'Home'}
        tabBarOptions={{
          activeTintColor: '#111',
          // style: [!commonStore.isBottomTabShow ? { display: 'none' } : {}],
        }}
      >
        <Tab.Screen
          name={'Home'}
          options={{
            title: '홈',
            tabBarVisible: commonStore.isBottomTabShow,
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              return (
                <BottomTabIcon
                  focused={focused}
                  size={52}
                  source={
                    focused
                      ? require('assets/images/navigation/marketOn.png')
                      : require('assets/images/navigation/marketOff.png')
                  }
                />
              );
            },
          }}
          component={HomeNavigation}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
});

const BottomTabIcon = styled.Image<{ focused: boolean; size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  ${(props) => (props.focused ? null : 'tint-color : #ccc')};
`;

export default NavController;
