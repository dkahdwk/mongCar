import React from 'react';
import Toast, { ToastConfig } from 'react-native-toast-message';
import CustomBaseToast from 'components/CustomBaseToast';

const CustomToast = () => {
  const toastConfig: ToastConfig = {
    success: (props) => (
      <CustomBaseToast
        toastProps={props}
        icon={require('assets/images/icons/common/confirm.png')}
      />
    ),
    info: (props) => (
      <CustomBaseToast
        toastProps={props}
        icon={require('assets/images/icons/common/info_circle.png')}
      />
    ),
    error: (props) => (
      <CustomBaseToast
        toastProps={props}
        icon={require('assets/images/icons/common/exclamation_in_triangle.png')}
      />
    ),
  };

  return <Toast config={toastConfig} />;
};

export default CustomToast;
