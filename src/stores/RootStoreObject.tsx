import MapStore from 'stores/MapStore';
import AuthStore from 'stores/AuthStore';
import UIStore from 'stores/UIStore';

// eslint-disable-next-line import/prefer-default-export
export const RootStoreObject = {
  authStore: new AuthStore(),
  mapStore: new MapStore(),
  uiStore: new UIStore(),
};
