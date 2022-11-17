import { isUndefined } from 'lodash';
import { Alert, Platform } from 'react-native';
import Toast, { ToastPosition } from 'react-native-toast-message';
import UIStore from 'stores/UIStore';

type ToastType = 'success' | 'error' | 'info';

interface ShowToastOptions {
  text: string;
  subText?: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  onPress?: () => void;
}

export const showToast = ({
  text,
  subText,
  type = 'success',
  duration,
  position = 'top',
  onPress,
}: ShowToastOptions) => {
  if (typeof subText === 'undefined') {
    Toast.show({ text1: text, type, visibilityTime: duration || 2500, position, onPress });
  } else {
    Toast.show({
      text1: text,
      text2: subText,
      type,
      visibilityTime: duration || 2500,
      position,
      onPress: () => {
        if (typeof onPress !== 'undefined') {
          Toast.hide();
          onPress();
        }
      },
    });
  }
};

export const closeToast = () => {
  Toast.hide();
};

export const showConfirm = (
  uiStore: UIStore,
  title: string,
  message: string,
  onConfirmed: () => void,
  onCancel?: () => void,
  confirmText?: string,
  cancelText?: string,
  isSingle?: boolean,
) => {
  const platform = Platform.OS;
  if (platform === 'ios') {
    Alert.alert(title, message, [
      {
        text: isUndefined(confirmText) ? '예' : confirmText,
        onPress: onConfirmed,
      },
      {
        text: isUndefined(cancelText) ? '아니오' : cancelText,
        onPress: onCancel,
      },
    ]);
  } else if (platform === 'android') {
    uiStore.confirm.show({
      title,
      message,
      onConfirmed,
      onCancel,
      isSingle,
    });
  }
};
