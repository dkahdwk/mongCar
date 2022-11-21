import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

interface DefaultProps {
  color?: string;
  size: 'large' | 'small';
  containerStyle?: StyleProp<ViewStyle>;
}

const Loader = ({ color = '#5f5f5f', size = 'small', containerStyle }: DefaultProps) => {
  return (
    <Container style={containerStyle}>
      <ActivityIndicator color={color} size={size} />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default Loader;
