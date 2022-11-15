/**
 * iphoneHelper.js (iphone X부터 iphone에 생긴 하단탭이 있는지 없는지 구별과 하단탭의
 * 높이를 구해주는 유틸리티 파일입니다. 구글에서 서칭해서 관련 코드 자료를 바탕으로 작성했습니다.)
 * */
import { Dimensions, Platform, StatusBar } from 'react-native';

export const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 926)
  );
};

export const ifIphoneX = (iphoneXStyle: number, regularStyle: number) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

export const getStatusBarHeight = (safe) => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
};

export const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};
