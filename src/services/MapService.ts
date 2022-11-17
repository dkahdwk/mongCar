/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-empty-function */
import { showConfirm } from 'utils/DialogHelper';
import { RootStoreObject } from 'stores/RootStoreObject';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import Config from 'react-native-config';
import axios from 'axios';

interface NaverAddressElement {
  code: string;
  longName: string;
  shortName: string;
  types: string[];
}

export interface NaverAddress {
  addressElements: NaverAddressElement[];
  englishAddress: string;
  jibunAddress: string;
  roadAddress: string;
  x: string;
  y: string;
}

export interface GeocodingResponse {
  addresses: NaverAddress[];
  errorMessage: string;
  meta: { count: number; page: number; totalCount: number };
  status: string;
}

interface Coords {
  crs: string;
  x: number;
  y: number;
}

export interface ReverseGeocodingResponse {
  results: ReverseGeocodingResult[];
  status: {
    code: number;
    message: string;
    name: string;
  };
}

interface ReverseGeocodingResult {
  code: { id: string; mappingId: string; type: string };
  land: {
    addition0: {
      type: string;
      value: string;
    };
    addition1: {
      type: string;
      value: string;
    };
    addition2: {
      type: string;
      value: string;
    };
    addition3: {
      type: string;
      value: string;
    };
    addition4: {
      type: string;
      value: string;
    };
    coords: {
      center: Coords;
      name: string;
      type: string;
    };
    name: string;
    number1: string;
    number2: string;
    // region: {
    //     area0: {coords: Coords; name: string; alias?: string};
    //     area1: {coords: Coords; name: string; alias?: string};
    //     area2: {coords: Coords; name: string; alias?: string};
    //     area3: {coords: Coords; name: string; alias?: string};
    //     area4: {coords: Coords; name: string; alias?: string};
    // };
  };
  name: string;
  region: {
    area0: { coords: Coords; name: string; alias?: string };
    area1: { coords: Coords; name: string; alias?: string };
    area2: { coords: Coords; name: string; alias?: string };
    area3: { coords: Coords; name: string; alias?: string };
    area4: { coords: Coords; name: string; alias?: string };
  };
}

type Props = {
  isShownConfirm: boolean;
};

const store = RootStoreObject;

const REVERSE_GEOCODING_HEADERS = {
  'X-NCP-APIGW-API-KEY-ID': Config.NAVER_MAP_REVERSE_GEOCODING_CLIENT_ID,
  'X-NCP-APIGW-API-KEY': Config.NAVER_MAP_REVERSE_GEOCODING_CLIENT_SECRET,
};

const GEOCODING_HEADERS = {
  'X-NCP-APIGW-API-KEY-ID': Config.NAVER_MAP_GEOCODING_CLIENT_ID,
  'X-NCP-APIGW-API-KEY': Config.NAVER_MAP_GEOCODING_CLIENT_SECRET,
};

/**
 * @Description 내 위치 정보를 활용 할 시, 호출하여 권한을 획득한다
 */
const getGeolocationPermission = async (props: Props): Promise<boolean> => {
  let isGranted = false;
  if (Platform.OS === 'ios') {
    await Geolocation.requestAuthorization('always').then((result) => {
      if (result === 'granted') {
        isGranted = true;
      } else {
        if (typeof props?.isShownConfirm === 'undefined' || props?.isShownConfirm) {
          Alert.alert(
            '실패',
            '위치 정보 제공을 거부하셨습니다. 앱 설정에서 다시 허용하시겠습니까?',
            [
              { text: '아니오', onPress: () => {} },
              {
                text: '예',
                onPress: () => {
                  /** 해당 앱 설정으로 이동시켜 사용자에게 위치 권한 재설정을 유도한다. */
                  Linking.openSettings();
                },
              },
            ],
          );
        }
      }
    });
  } else if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ]).then((result) => {
      if (
        result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
        result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
      ) {
        isGranted = true;
      } else {
        if (typeof props?.isShownConfirm === 'undefined' || props?.isShownConfirm) {
          showConfirm(
            store.uiStore,
            '위치 정보 제공을 거부하셨습니다.',
            '앱 설정에서 다시 허용하시겠습니까?',
            () => Linking.openSettings(),
          );
        }
      }
    });
  }
  return isGranted;
};

/**
 * @Description 현재 위치의 좌표값을 취득 {latitude, longitude}
 * 위치 정보 기반이기 때문에 권한 체크 선행
 * 값을 받아오는 타이밍 문제로 callback으로 값을 받아 사용합니다
 * @param options
 */
const getCurrentLocation = async (
  callback: (coords: GeoPosition) => void,
  options?: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  },
) => {
  /** 자기 위치를 받아온다. */
  await Geolocation.getCurrentPosition(
    async (position) => {
      await callback(position);
    },
    (error) => {
      console.log(error.code, error.message);
    },
    {
      enableHighAccuracy: options?.enableHighAccuracy || true,
      timeout: options?.timeout || 15000,
      maximumAge: options?.maximumAge || 10000,
    },
  );
};

/**
 * 검색어 (지번 또는 도로명)으로 검색하여 목록을 취득
 * @param address 주소 검색어
 * @param options coordinate : 기준 좌표 / filter : 법정동 혹은 행정동 필터
 */
const geocoding = async (
  address: string,
  options?: {
    coordinate?: { longitude: number; latitude: number };
    filter?: 'HCODE' | 'BCODE';
    page?: number;
    count?: number;
  },
): Promise<GeocodingResponse> => {
  const params: any = {
    query: address,
  };

  if (options?.coordinate)
    params.coordinate = `${options.coordinate.longitude},${options.coordinate.latitude}`;
  if (options?.filter) params.filter = options.filter;
  if (options?.page) params.page = options.page;
  if (options?.count) params.count = options.count;

  let output = undefined;

  const result = await axios
    .get(Config.NAVER_MAP_GEOCODING_URL, { params: params, headers: GEOCODING_HEADERS })
    .then((result) => {
      output = result.data as GeocodingResponse;
    });

  return output;
};

/**
 * 좌표 값으로 해당 위치의 상세 주소 취득
 * @param longitude 경도 y 좌표
 * @param latitude 위도 x 좌표
 * @param orderType addr: 지번 / roadaddr: 도로명 / legalcode: 법정동 / admcode: 행정동
 */
const reverseGeocoding = async (
  longitude: string,
  latitude: string,
  orderType?: 'addr' | 'roadaddr' | 'legalcode' | 'admcode',
): Promise<ReverseGeocodingResponse> => {
  const coords = `${longitude}, ${latitude}`;
  let output: ReverseGeocodingResponse = {} as ReverseGeocodingResponse;
  await axios
    .get(Config.NAVER_MAP_REVERSE_GEOCODING_URL, {
      params: {
        coords,
        output: 'json',
        orders: orderType || 'legalcode',
      },
      headers: REVERSE_GEOCODING_HEADERS,
    })
    .then((res) => {
      output = res.data as ReverseGeocodingResponse;
    })
    .catch((error) => {
      console.log(error);
    });
  return output;
};

const MapService = {
  getGeolocationPermission,
  getCurrentLocation,
  geocoding,
  reverseGeocoding,
};

export default MapService;
