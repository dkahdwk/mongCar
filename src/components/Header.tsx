import React from 'react';
import { Platform, StatusBar, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isIphoneX } from 'utils/IosHelper';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import Text from 'components/Text';

interface DefaultProps {
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  useBackButton?: boolean | undefined;
  isNavigation?: boolean;
  onPressGoBack?: () => void;
  onPressTitle?: () => void;
  disableBottomBorder?: boolean;
  disableGetNotificationCount?: boolean;
}

const Header = observer(
  ({
    title,
    titleStyle,
    useBackButton,
    containerStyle,
    isNavigation = true,
    onPressGoBack,
    disableBottomBorder,
  }: DefaultProps) => {
    const navigation = isNavigation ? useNavigation() : undefined;

    const handleOnPress = () => {
      if (typeof onPressGoBack !== 'undefined') {
        onPressGoBack();
      } else if (typeof navigation !== 'undefined') {
        navigation.goBack();
      }
    };

    return (
      <Container style={containerStyle} disableBottomBorder={disableBottomBorder}>
        <StatusBar
          barStyle="dark-content"
          /**
           * translucent: Android 에서만 동작한다. (투명 배경의 목적)
           * backgroundColor: Android 에서만 동작한다. (투명 배경의 목적)
           * */
          backgroundColor={'transparent'}
          translucent
        />
        <Row>
          {useBackButton !== false && (
            <LeftButtonContainer>
              <BackButton onPress={handleOnPress}>
                <BackIcon source={require('assets/images/arrow-chevron-left.png')} />
              </BackButton>
            </LeftButtonContainer>
          )}
          <TitleContainer style={useBackButton}>
            <Title style={titleStyle}>{title}</Title>
          </TitleContainer>
        </Row>
      </Container>
    );
  },
);

const Container = styled.View<{ disableBottomBorder?: boolean }>`
  width: 100%;
  /**
   * 기존 70높이에서
   * iPhoneX: 35, iPhone: 22.5, Android: 30 만큼 추가 (상태바 높이)
   */
  height: ${isIphoneX() ? 100 : Platform.OS === 'ios' ? 92.5 : 100}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  position: relative;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 100;
  // iPhoneX: 35, iPhone: 22.5, Android: 30 만큼 추가 (상태바 높이)
  padding: ${isIphoneX() ? 30 : Platform.OS === 'ios' ? 22.5 : 30}px 15px 0 15px;
  border-bottom-width: ${(props) => (props.disableBottomBorder ? 0 : 1)}px;
  border-color: #eee;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LeftButtonContainer = styled.View`
  width: 50px;
  z-index: 2;
`;

const TitleContainer = styled.View<{ style: any }>`
  justify-content: center;
  ${(props) => props?.style === false && 'margin: 0 0 0 20px'};
`;

const Title = styled(Text)`
  font-size: 20px;
  font-family: ${(props) => props.theme.families.medium};
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const BackIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

export default Header;
