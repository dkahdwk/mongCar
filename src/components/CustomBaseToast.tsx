import React from 'react';
import { BaseToast, ToastConfigParams } from 'react-native-toast-message';
import { ImageSourcePropType } from 'react-native';
import DEVICE_SCREEN from 'utils/ConstantsHelper';
import styled from 'styled-components/native';
import theme from 'styles/theme';

interface CustomToastInterface {
  toastProps: ToastConfigParams<any>;
  backgroundColor?: string;
  textColor?: string;
  icon: ImageSourcePropType;
}

const CustomBaseToast = ({
  toastProps,
  backgroundColor,
  textColor,
  icon,
}: CustomToastInterface) => {
  const processedProps = { ...toastProps };
  if (typeof toastProps.text1 === 'string') {
    processedProps.text1 = toastProps.text1;
  }
  if (typeof toastProps.text2 === 'string') {
    processedProps.text2 = toastProps.text2;
  }

  return (
    <BaseToast
      {...processedProps}
      style={{
        backgroundColor: backgroundColor || theme.colors.pointColor,
        borderRadius: 8,
        borderLeftWidth: 0,
        width: DEVICE_SCREEN.width * 0.9,
        height: 60,
      }}
      contentContainerStyle={{
        backgroundColor: backgroundColor || theme.colors.pointColor,
        borderRadius: 8,
        paddingLeft: 0,
      }}
      text1Style={{ color: textColor || 'white', fontSize: 12 }}
      text2Style={{ color: textColor || 'white', fontSize: 10 }}
      renderLeadingIcon={() => (
        <LeadingIconContainer>
          <LeadingIcon tintColor={textColor} source={icon} />
        </LeadingIconContainer>
      )}
      renderTrailingIcon={() => (
        <TrailingIconContainer onPress={() => toastProps.hide()}>
          <TrailingIcon
            tintColor={textColor}
            source={require('assets/images/icons/common/cancel.png')}
          />
        </TrailingIconContainer>
      )}
    />
  );
};

const LeadingIconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 0 10px 0 22px;
`;

const LeadingIcon = styled.Image<{ tintColor?: string }>`
  width: 20px;
  height: 20px;
  tint-color: ${(props) => props.tintColor || 'white'};
`;

const TrailingIcon = styled.Image<{ tintColor?: string }>`
  width: 12px;
  height: 12px;
  tint-color: ${(props) => props.tintColor || 'white'};
`;

const TrailingIconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 0 20px 0 0;
`;

export default CustomBaseToast;
