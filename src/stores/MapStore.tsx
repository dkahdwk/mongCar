/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */
import { makeAutoObservable } from 'mobx';

class MapStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default MapStore;
