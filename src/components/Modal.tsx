import React, { useEffect, useState } from 'react';
import { View, TouchableWithoutFeedback, Keyboard, KeyboardEvent, Platform } from 'react-native';
import { useStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import * as OldModal from 'react-native-modal';
import styled from 'styled-components/native';
import Header from 'components/Header';
import Text from 'components/Text';

const Modal = observer(() => {
  const { uiStore } = useStore();
  const [keyboardShow, setKeyboardShow] = useState<number>(0);

  const isAndroidKeyboardMargin = () => {
    if (Platform.OS === 'android' && keyboardShow && uiStore.modal.options?.isKeyboardMargin) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardShow(Math.round(e.endCoordinates.height));
    });
    const keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShow(0);
    });
    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, [uiStore.modal.options?.avoidKeyboard]);

  return (
    <OldModal.ReactNativeModal
      avoidKeyboard={
        typeof uiStore.modal.options?.avoidKeyboard !== 'undefined'
          ? uiStore.modal.options?.avoidKeyboard
          : true
      }
      /** statusBarTranslucent: height가 100% 일때는, header와 레이아웃 사이드이펙트 없도록 true */
      statusBarTranslucent={uiStore.modal.options?.height === '100%'}
      style={[
        {
          marginHorizontal: 0,
          marginVertical: 0,
          // (Android) 키보드 출현시 View를 안가리도록 적당한 margin을 부여한다
          marginTop: isAndroidKeyboardMargin() ? -100 : 0,
        },
        uiStore.modal.options?.modalStyle,
      ]}
      isVisible={uiStore.modal.modalShow}
      animationIn={uiStore.modal?.options?.modalProps?.animationIn}
      animationOut={uiStore.modal?.options?.modalProps?.animationOut}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      backdropOpacity={0.5}
      backdropTransitionOutTiming={0}
      onBackButtonPress={() => {
        if (typeof uiStore.modal.options?.onBackButtonPress !== 'undefined') {
          uiStore.modal.options.onBackButtonPress();
        } else {
          uiStore.modal.close();
        }
      }}
      onBackdropPress={() => {
        uiStore.modal.close();
      }}
      onDismiss={uiStore.modal.options?.onDismiss}
    >
      <TouchableWithoutFeedback
        /**
         * webview에서는 충돌하기때문에 props.disabled=true 값을 주어야한다.
         * props.disabled의 기본값은 false.
         */
        disabled={
          typeof uiStore.modal.options?.disabled !== 'undefined'
            ? uiStore.modal.options?.disabled
            : false
        }
        onPress={Keyboard.dismiss}
      >
        <View
          style={[
            {
              width: '100%',
              // modal을 전체 화면으로 덮고 싶을경우, height: '100%'를 넘겨주면 된다.
              height: uiStore.modal.options?.height,
              backgroundColor: '#fff',
              borderRadius: 6,
            },
            uiStore.modal.options?.containerStyle,
          ]}
        >
          {/* header를 사용하고자 하는 경우, true값을 주면 나온다. */}
          {uiStore.modal.options?.header && (
            <Header
              isNavigation={false}
              title={uiStore.modal.options.headerTitle}
              onPressGoBack={() => uiStore.modal.close()}
              containerStyle={uiStore.modal.options.headerContainerStyle}
              disableGetNotificationCount
            />
          )}
          <View style={[uiStore.modal.options?.componentContainerStyle]}>
            {uiStore.modal.options?.component}
          </View>
          {(typeof uiStore.modal.options?.buttonVisible === 'undefined' ||
            uiStore.modal.options?.buttonVisible) && (
            <ButtonContainer>
              <Button
                style={uiStore.modal.options?.buttonStyle}
                onPress={() => uiStore.modal.close()}
              >
                <ButtonTitle style={uiStore.modal.options?.buttonTextStyle}>
                  {uiStore.modal.options?.buttonText ? uiStore.modal.options.buttonText : '닫기'}
                </ButtonTitle>
              </Button>
            </ButtonContainer>
          )}
        </View>
      </TouchableWithoutFeedback>
    </OldModal.ReactNativeModal>
  );
});

const ButtonContainer = styled.View`
  width: 100%;
  padding: 0 15px 0 15px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  align-self: center;
  border-radius: 2px;
  background-color: #e6e6e6;
  margin: 20px 0 20px 0;
`;

const ButtonTitle = styled(Text)`
  font-size: 16px;
  font-family: ${(props) => props.theme.families.medium};
`;

export default Modal;
