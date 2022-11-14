/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */
import { makeAutoObservable } from 'mobx';

class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default AuthStore;
