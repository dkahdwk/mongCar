import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigation from 'navigations/HomeNavigation';

const NavController = () => {
  return (
    <NavigationContainer>
      <HomeNavigation />
    </NavigationContainer>
  );
};

export default NavController;
