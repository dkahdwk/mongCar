import React from 'react';
import NavController from 'navigations/NavController';
import { MobxProvider } from 'stores/RootStore';

const App = () => {
  return (
    <MobxProvider>
      <NavController />
    </MobxProvider>
  );
};

export default App;
