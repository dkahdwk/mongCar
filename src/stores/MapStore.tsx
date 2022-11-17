/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */
import { makeAutoObservable } from 'mobx';

interface Coord {
  latitude: number;
  longitude: number;
}

class MapStore {
  constructor() {
    makeAutoObservable(this);
  }

  // google place 검색결과
  googleRegions: any = undefined;

  // 현재 위치
  myCoord: Coord | undefined = undefined;

  // 지역 검색
  singleRoadAddress = '';

  setGoogleRegions = (googleRegions: any) => {
    this.googleRegions = googleRegions;
  };

  setMyCoord = (myCoord: Coord | undefined) => {
    this.myCoord = myCoord;
  };

  // 지역검색 결과 저장
  setSingleRoadAddress = (address: string) => {
    if (typeof address === 'string') {
      this.singleRoadAddress = address;
    }
  };
}

export default MapStore;
