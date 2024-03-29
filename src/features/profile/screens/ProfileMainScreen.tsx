import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomStackParamList } from 'types/navigationTypes';
import { useStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import Header from 'components/Header';

const ProfileMainScreen = observer(() => {
  const navigation =
    useNavigation<StackNavigationProp<CustomStackParamList, 'ProfileMainScreen'>>();
  const { uiStore } = useStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={'프로필'} useBackButton={false} />,
    });
  }, []);

  return (
    <Container>
      {/*  */}
      {/*  */}
    </Container>
  );
});

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export default ProfileMainScreen;
