import { makeAutoObservable } from 'mobx';

class CommonStore {
  root: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  isBottomTabShow = true;

  deepLink: string | undefined = undefined;

  setBottomTabShow(isShow: boolean) {
    this.isBottomTabShow = isShow;
  }

  setDeepLink = (deepLink: string | undefined) => {
    this.deepLink = deepLink;
  };
}

export default CommonStore;
