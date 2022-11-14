import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ModalProps } from 'react-native-modal';

export type BottomSheetOptions = {
  component: React.ReactElement | React.ReactElement[];
  title?: string;
  subTitle?: string;
  isSliderIndicator?: boolean;
  useCustomCancel?: boolean;
  avoidKeyboard?: boolean;
  buttonText?: string;
  disabled?: boolean;
  type?: 'bottomSheet' | 'drawer';
  onDismiss?: () => void;
  onApply?: (object?: any) => void;
};

export type ModalOptions = {
  component: any;
  title?: string;
  subTitle?: string;
  modalProps?: Pick<ModalProps, 'animationIn' | 'animationOut'>;
  animationTiming?: { in?: number; out?: number };
  modalStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  componentContainerStyle?: StyleProp<ViewStyle>;
  header?: boolean;
  headerTitle?: string;
  headerContainerStyle?: StyleProp<ViewStyle>;
  buttonVisible?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  height?: number | string;
  buttonText?: string;
  disabled?: boolean;
  onDismiss?: () => void;
  onApply?: (object?: any) => void;
  onBackButtonPress?: () => void;
  avoidKeyboard?: boolean;
  isKeyboardMargin?: boolean;
};

export type ConfirmOptions = {
  title: string;
  message: string;
  onConfirmed?: () => void;
  onCancel?: () => void;
  isSingle?: boolean;
};
