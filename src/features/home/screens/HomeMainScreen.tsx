import React, { useLayoutEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomStackParamList } from 'types/navigationTypes';
import { useStore } from 'stores/RootStore';
import { Platform } from 'react-native';
import { observer } from 'mobx-react';
import MapView, { Camera, Marker, Region } from 'react-native-maps';
import styled from 'styled-components/native';
import Header from 'components/Header';
import theme from 'styles/theme';
import DEVICE_SCREEN from 'utils/ConstantsHelper';

const HomeMainScreen = observer(() => {
  const navigation = useNavigation<StackNavigationProp<CustomStackParamList, 'HomeMainScreen'>>();
  const { mapStore, uiStore } = useStore();
  const mapRef = useRef<MapView>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={'메인'} />,
    });
  }, []);

  return (
    <Container>
      <MapView
        ref={mapRef}
        minZoomLevel={13}
        maxZoomLevel={20}
        showsUserLocation
        loadingEnabled
        rotateEnabled={false}
        provider={'google'}
        loadingIndicatorColor={theme.colors.pointColor}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        style={{
          width: DEVICE_SCREEN.width,
          height: DEVICE_SCREEN.height - (Platform.OS === 'android' ? 205 : 155),
        }}
        region={{
          latitude: 37.646641,
          longitude: 127.119396,
          latitudeDelta: 0.9,
          longitudeDelta: 0.3,
        }}
        onRegionChangeComplete={(region: Region) => {
          // onChangeCamera(region);
        }}
        // onPress={() => handleMapClick()}
      />
    </Container>
  );
});

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export default HomeMainScreen;
