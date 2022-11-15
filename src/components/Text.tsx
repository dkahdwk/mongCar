import React from 'react';
import { Text as DefaultText, TextStyle, StyleProp, TextProps } from 'react-native';
import styled from 'styled-components/native';

interface DefaultProps extends TextProps {
  children: any;
  style?: StyleProp<TextStyle>;
}

const Text = ({ children, style }: DefaultProps) => {
  return (
    <CommonText style={style} allowFontScaling={false}>
      {children}
    </CommonText>
  );
};

const CommonText = styled(DefaultText)`
  color: #111;
  letter-spacing: -0.32;
  font-family: ${(props) => props.theme.families.regular};
`;

export default Text;
