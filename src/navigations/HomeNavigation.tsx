import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomStackParamList } from 'types/navigationTypes';

const HomeNavigation = () => {
  const navigation = useNavigation<StackNavigationProp<CustomStackParamList>>();
  return (
    <>
      {/*  */}
      {/*  */}
    </>
  );
};

export default HomeNavigation;
