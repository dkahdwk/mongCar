import React from 'react';
import NavController from 'navigations/NavController';
import { ThemeProvider } from 'styled-components';
import { MobxProvider } from 'stores/RootStore';
import { StatusBar } from 'react-native';
import Modal from 'components/Modal';
import theme from 'styles/theme';

const App = () => {
  return (
    <MobxProvider>
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle="dark-content"
          /**
           * translucent: Android 에서만 동작한다. (투명 배경의 목적)
           * backgroundColor: Android 에서만 동작한다. (투명 배경의 목적)
           * */
          backgroundColor={'transparent'}
          translucent
        />
        <NavController />
        <Modal />
      </ThemeProvider>
    </MobxProvider>
  );
};

export default App;
