import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomStackParamList } from 'types/navigationTypes';
import { useStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import HomeMapContainers from 'features/home/containers/HomeMapContainers';
import styled from 'styled-components/native';
import Header from 'components/Header';

const HomeMainScreen = observer(() => {
  const navigation = useNavigation<StackNavigationProp<CustomStackParamList, 'HomeMainScreen'>>();
  const { uiStore } = useStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={'메인'} />,
    });
  }, []);

  return (
    <Container>
      <HomeMapContainers />
    </Container>
  );
});

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export default HomeMainScreen;
