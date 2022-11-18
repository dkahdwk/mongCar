import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from 'components/Header';
import React, { useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import { CustomStackParamList } from 'types/navigationTypes';

const HomeMainScreen = () => {
  const navigation = useNavigation<StackNavigationProp<CustomStackParamList, 'HomeMainScreen'>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={'메인'} />,
    });
  }, []);

  return (
    <Container>
      {/*  */}
      {/*  */}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export default HomeMainScreen;
