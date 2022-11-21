import CommonStore from 'stores/CommonStore';
import AuthStore from 'stores/AuthStore';
import MapStore from 'stores/MapStore';
import UIStore from 'stores/UIStore';

// eslint-disable-next-line import/prefer-default-export
export const RootStoreObject = {
  commonStore: new CommonStore(),
  authStore: new AuthStore(),
  mapStore: new MapStore(),
  uiStore: new UIStore(),
};
