import { Platform } from 'react-native';
import { getBottomSpace, isIphoneX } from 'utils/IosHelper';

/**
 * 1. 기종마다 다른 Container의 paddingBottom 구하기.
 * 2. KeyboardEvent로 얻은 키보드 높이값을 props로 받아야 합니다.
 * */
const GetPaddingBottom = (keyboardHeight: number) => {
  if (isIphoneX()) {
    return getBottomSpace() + keyboardHeight;
  } else if (Platform.OS === 'ios') {
    return 20 + keyboardHeight;
  } else {
    return 20;
  }
};

export default GetPaddingBottom;
