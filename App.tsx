import React from 'react';
import NavController from 'navigations/NavController';
import { ThemeProvider } from 'styled-components';
import { MobxProvider } from 'stores/RootStore';
import theme from 'styles/theme';

const App = () => {
  return (
    <MobxProvider>
      <ThemeProvider theme={theme}>
        <NavController />
      </ThemeProvider>
    </MobxProvider>
  );
};

export default App;
