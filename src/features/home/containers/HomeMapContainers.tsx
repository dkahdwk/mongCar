import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RegionDto, RegionCountDto, ItemDto } from 'features/home/dummy/DummyDto';
import { BackHandler, FlatList, Platform, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomStackParamList } from 'types/navigationTypes';
import { mapItems } from 'features/home/dummy/DummyData';
import { ModalOptions } from 'types/interfaces';
import { commaToPrice } from 'utils/TextHelper';
import { useStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from '@gorhom/bottom-sheet';
import SearchLocationModal from 'components/SearchLocationModal';
import MapView, { Camera, Marker, Region } from 'react-native-maps';
import DEVICE_SCREEN from 'utils/ConstantsHelper';
import Header from 'components/Header';
import Loader from 'components/Loader';
import styled from 'styled-components/native';
import MapService from 'services/MapService';
import Text from 'components/Text';
import theme from 'styles/theme';
import moment from 'moment';

interface ItemByMapProps {
  latitude: number;
  longitude: number;
  radiusProp: number | undefined;
  zoomProp?: number;
}

interface Coord {
  longitude: number;
  latitude: number;
}

const MarketSearchMapScreen = observer(() => {
  const route = useRoute<RouteProp<CustomStackParamList, 'HomeMainScreen'>>();
  const navigation = useNavigation<StackNavigationProp<CustomStackParamList>>();
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const { commonStore, mapStore, uiStore } = useStore();
  const [recentMyCoord, setRecentMyCoord] = useState<Coord>();
  const [zoom, setZoom] = useState<number>(13);
  const [isMapItemLoading, setIsMapItemLoading] = useState<boolean>(false);
  const [currentRadius, setCurrentRadius] = useState<number>(4500);
  const [firstEntry, setFirstEntry] = useState<boolean>(false);
  const [myLocationButtonLoading, setMyLocationButtonLoading] = useState<boolean>(false);
  const [selectMarkerItem, setSelectMarkerItem] = useState<RegionCountDto>();
  const [viewMargin, setViewMargin] = useState<number>(0);
  const [isMax, setIsMax] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimate, setIsAnimate] = useState<boolean>(false);
  const [headerViewHeight, setHeaderViewHeight] = useState<number>(120);

  const keyExtractor = useCallback((item: any, index: number) => index.toString(), []);

  // bottomSheet 단계별 스냅 높이 위치 선정
  const snapPoints = useMemo(
    () => [120, 420, DEVICE_SCREEN.height - (Platform.OS === 'android' ? 250 : 200)],
    [],
  );

  // 자신의 위치를 가져온다.
  const getMyLocation = async ({ isCurrentShownConfirm }: { isCurrentShownConfirm: boolean }) => {
    try {
      const isGranted = await MapService.getGeolocationPermission({
        isShownConfirm: isCurrentShownConfirm,
      });
      if (isGranted) {
        await MapService.getCurrentLocation(async (position) => {
          const reverseGeocodingResponse = await MapService.reverseGeocoding(
            String(position.coords.longitude),
            String(position.coords.latitude),
            'admcode',
          );
          const region = reverseGeocodingResponse?.results[0]?.region;
          const address = `${region?.area1.name} ${region?.area2.name} ${region?.area3.name}`;
          await handleSearchAddress(address, position.coords.latitude, position.coords.longitude);
        });
      } else {
        mapStore.setMyCoord({
          longitude: 127.066,
          latitude: 37.54653,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 주소로 검색
  const handleSearchAddress = async (
    currentAddress: string,
    currentLatitude: number,
    currentLongitude: number,
  ) => {
    if (currentAddress === '') {
      getMyLocation({ isCurrentShownConfirm: false });
    } else {
      mapStore.setMyCoord({
        latitude: currentLatitude,
        longitude: currentLongitude,
      });
      // await mapStore.getRegions({
      //   address: currentAddress,
      //   latitude: currentLatitude,
      //   longitude: currentLongitude,
      //   page: 0,
      //   size: 10,
      // });
    }
  };

  // 맵 처음 진입시 이벤트
  const entryEvent = async () => {
    if (typeof mapStore?.myCoord === 'undefined') return;
    await getItemsByMap({
      latitude: mapStore.myCoord?.latitude,
      longitude: mapStore.myCoord?.longitude,
      radiusProp: currentRadius,
      zoomProp: 13,
    });
    setFirstEntry(false);
  };

  // 반경둘레만큼 지역을 보여줄 용도의 함수
  const calculateRadius = (zoomLevel: number) => {
    const zoom = Math.ceil(zoomLevel);
    let newRadius;

    if (zoom <= 10) {
      newRadius = 20000;
    } else if (zoom <= 11) {
      newRadius = 10000;
    } else if (zoom <= 12) {
      newRadius = 6000;
    } else if (zoom <= 13) {
      newRadius = 4500;
    } else if (zoom <= 14) {
      newRadius = 3500;
    } else if (zoom <= 15) {
      newRadius = 2000;
    } else if (zoom <= 16) {
      newRadius = 1500;
    } else if (zoom <= 17) {
      newRadius = 1000;
    } else if (zoom <= 18) {
      newRadius = 800;
    }

    if (typeof newRadius !== 'undefined') {
      setCurrentRadius(newRadius);
    }

    return newRadius;
  };

  // 맵 이동시에 발생하는 handler
  const onChangeCamera = async (region: Region) => {
    if (typeof mapStore.myCoord === 'undefined') return;
    const mapDetailInfo: Camera | undefined = await mapRef.current?.getCamera();

    setRecentMyCoord({
      latitude: region?.latitude,
      longitude: region?.longitude,
    });
    if (firstEntry) {
      // 처음 화면에 진입할때는 해당 함수를 실행시킨다
      entryEvent();
    } else {
      if (mapDetailInfo?.zoom === zoom) {
        if (isOpen && isAnimate) {
          // isAnimate는 줌을 변경하지 않고, 맵을 움직였을때, 열려있는 bottomSheet를 최소화 시키는 역할
          setIsAnimate(false);
          bottomSheetRef.current?.snapToIndex(0);
          if (selectMarkerItem) {
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          }
        }
      }

      try {
        // 지역기반 상품의 데이터를 불러온다
        await getItemsByMap({
          latitude: region.latitude,
          longitude: region.longitude,
          radiusProp: calculateRadius(Number(mapDetailInfo?.zoom)),
          zoomProp: Number(mapDetailInfo?.zoom),
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  // 지역기반 상품의 데이터를 불러온다.
  const getItemsByMap = async ({ latitude, longitude, radiusProp, zoomProp }: ItemByMapProps) => {
    try {
      if (typeof zoomProp !== 'undefined') {
        setZoom(zoomProp);
      }
      // await itemStore.getItemsByMap({
      //   latitude,
      //   longitude,
      //   radius: radiusProp,
      //   ...currentParameter,
      // });
    } catch (e: any) {
      console.log(e);
    }
  };

  // modal에서 지도 결과 선택 핸들러
  const onSelect = (item: RegionDto) => {
    if (item?.latitude && item?.longitude) {
      mapStore.setMyCoord({ latitude: item?.latitude, longitude: item?.longitude });
    }
  };

  // 지역검색 modal show 핸들러
  const handleShowSearchLocation = () => {
    // 상품리스트 bottomSheet 비활성화
    bottomSheetRef.current?.close();

    const options: ModalOptions = {
      header: true,
      headerTitle: '지도 검색',
      height: '100%',
      component: <SearchLocationModal />,
      onApply: onSelect,
      // onDismiss: () => mapStore.setRegion([]),
    };
    uiStore.modal.show(options);
  };

  // bottomSheet 동작할 때, 발생하는 핸들러
  const onAnimate = useCallback((fromIndex: number, toIndex: number) => {
    setIsAnimate(true);

    if (toIndex === 0) {
      setViewMargin(-110);
      setHeaderViewHeight(100);
      setIsMax(false);
      setIsOpen(true);
    } else if (toIndex === 1) {
      setViewMargin(-200);
      setHeaderViewHeight(80);
      setIsMax(false);
      setIsOpen(true);
    } else if (toIndex === 2) {
      setHeaderViewHeight(80);
      setViewMargin(0);
      setIsMax(true);
      setIsOpen(true);
    } else {
      setIsAnimate(false);
      setIsOpen(false);
      setViewMargin(0);
    }
  }, []);

  // Marker onPress 핸들러
  const handlePressMarker = async (item: RegionCountDto) => {
    setSelectMarkerItem(item);
    setIsOpen(true);
    bottomSheetRef.current?.snapToIndex(1);

    // 마커의 주소와 새로 누른 주소가 다를경우에만 새롭게 데이터를 불러온다.
    if (selectMarkerItem?.region?.address !== item.region?.address) {
      try {
        setIsMapItemLoading(true);
        await mapStore.setMapItems([]);
        await mapStore.setMapItems(item?.items);
        setIsMapItemLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // 지도 onPress 이벤트
  const handleMapClick = () => {
    // 상품 스크롤 가장위로 이동 시키기
    if (isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      setIsOpen(false);
    }
  };

  // 지도상에서 나침반 이미지 누르면 내 위치로 이동
  const handleGoMyLocation = async () => {
    setMyLocationButtonLoading(true);
    setTimeout(async () => {
      if (typeof recentMyCoord !== 'undefined') {
        mapStore.setMyCoord({
          latitude: recentMyCoord?.latitude as number,
          longitude: recentMyCoord?.longitude as number,
        });
      }
      await getMyLocation({ isCurrentShownConfirm: true });
      setMyLocationButtonLoading(false);
    }, 500);
  };

  // 주소 텍스트 출력 (원하는 형태로)
  const getLocation = (location?: string) => {
    let newLocation;
    if (typeof location !== 'undefined') {
      newLocation = location.split(' ');
      newLocation = newLocation[newLocation.length - 1];
      return newLocation;
    }
  };

  // flatList의 onEndReached, 무한스크롤링
  const getMoreSearchResult = async () => {
    // if (itemStore.mapItemsPagination.totalPages - 1 === itemStore.mapItemsPagination.currentPage)
    //   return;
    // try {
    //   itemStore.getMapItems({
    //     regionCode: selectMarkerItem?.region?.code,
    //     page: itemStore.mapItemsPagination.currentPage + 1,
    //     size: 3,
    //     ...currentParameter,
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  };

  // flatList의 header
  const listHeaderComponent = () => {
    return (
      // (지역)동 정보 View
      <LocationInfoContainer style={{ height: headerViewHeight }}>
        <View>
          <InfoTitle>{getLocation(selectMarkerItem?.region?.address)}</InfoTitle>
          <WhiteRow>
            <InfoLabelContainer>
              <InfoLabelText>상세</InfoLabelText>
            </InfoLabelContainer>
            <InfoSubtitle>{selectMarkerItem?.region?.address}</InfoSubtitle>
          </WhiteRow>
        </View>
      </LocationInfoContainer>
    );
  };

  // flatList renderItem
  const renderItem = ({ item }: { item: ItemDto }) => {
    return (
      <ListButton
        onPress={() => {
          if (typeof item?.id !== 'undefined') {
            // navigation.navigate('ProductViewScreen', { itemId: item?.id });
          }
        }}
      >
        <ProductImg source={{ uri: item.image?.thumbnailUrl }} />
        <ProductRightContainer>
          <Price>
            {item.price === 0 ? '무료 나눔' : commaToPrice(item.price)}
            <PriceLabel> 원</PriceLabel>
          </Price>
          <ProductName numberOfLines={2}>{item.name}</ProductName>
          <WhiteRow top={2.5}>
            <RegionText numberOfLines={1}>
              {getLocation(selectMarkerItem?.region?.address)}{' '}
            </RegionText>
            <Date>/ {moment(item.createDate).fromNow()}</Date>
          </WhiteRow>
        </ProductRightContainer>
      </ListButton>
    );
  };

  // (Android) BackPress 이벤트
  const onBackPress = () => {
    if (isOpen) {
      setIsOpen(false);
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      navigation.goBack();
    }

    return true;
  };

  // (Android) navigation custom BackPress 이벤트 커스텀
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isOpen]),
  );

  useLayoutEffect(() => {
    // setCurrentParameter(route.params.parameter);
    // itemStore.setMapItems([]);
    getMyLocation({ isCurrentShownConfirm: false });

    navigation.setOptions({
      header: () => <Header title={'지도 검색'} useBackButton={false} />,
    });
    const subscribe = navigation.addListener('focus', () => {
      commonStore.setBottomTabShow(true);

      // 처음 화면에 진입인지를 파악해주는 state (android 이슈때문에 필요)
      setFirstEntry(true);
    });
    const unsubscribe = navigation.addListener('blur', () => {
      commonStore.setBottomTabShow(true);
      mapStore.setGoogleRegions(undefined);
    });

    return () => {
      subscribe();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 첫 진입이라고 체크
    setFirstEntry(true);
  }, []);

  return (
    <Container>
      <SearchButtonContainer>
        <SearchButton onPress={handleShowSearchLocation}>
          <SearchText>지역명을 입력해주세요</SearchText>
        </SearchButton>
      </SearchButtonContainer>
      {typeof mapStore.myCoord?.latitude !== 'undefined' &&
        typeof mapStore.myCoord?.longitude !== 'undefined' && (
          <View style={{ marginTop: viewMargin }}>
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
                latitude: mapStore.myCoord?.latitude,
                longitude: mapStore.myCoord?.longitude,
                latitudeDelta: 0.9,
                longitudeDelta: 0.3,
              }}
              onRegionChangeComplete={(region: Region) => {
                onChangeCamera(region);
              }}
              onPress={() => handleMapClick()}
            >
              {typeof mapItems !== 'undefined' &&
                mapItems.map((item: RegionCountDto) => (
                  <Marker
                    tracksViewChanges={false}
                    key={item?.region?.code}
                    coordinate={{
                      latitude: item?.region?.latitude as number,
                      longitude: item?.region?.longitude as number,
                    }}
                    onPress={() => handlePressMarker(item)}
                  >
                    <CustomMarker size={70}>
                      <CustomMarkerCountContainer>
                        <CustomMarkerCount>{String(item?.count)}</CustomMarkerCount>
                      </CustomMarkerCountContainer>
                      <CustomMarkerTitle>{getLocation(item?.region?.address)}</CustomMarkerTitle>
                    </CustomMarker>
                  </Marker>
                ))}
            </MapView>
            {!isMax && (
              <MyLocationButton headerViewHeight={headerViewHeight} onPress={handleGoMyLocation}>
                {myLocationButtonLoading ? (
                  <Loader size={'small'} />
                ) : (
                  <MyLocationButtonIcon source={require('assets/images/gps.png')} />
                )}
              </MyLocationButton>
            )}
          </View>
        )}
      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onAnimate={onAnimate}
        handleStyle={{ height: 20 }}
        handleIndicatorStyle={{
          width: 45.5,
          height: 2,
          backgroundColor: '#ddd',
          marginTop: 5,
        }}
        backdropComponent={(backdropProps): any => (
          <BottomSheetBackdrop
            {...backdropProps}
            style={{
              width: DEVICE_SCREEN.width,
              height: DEVICE_SCREEN.height,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
            }}
            disappearsOnIndex={1}
            appearsOnIndex={2}
            opacity={0.25}
          />
        )}
      >
        {isMapItemLoading ? (
          <Loader size="large" />
        ) : (
          <BottomSheetFlatList
            ref={flatListRef}
            scrollEnabled
            data={toJS(mapStore.mapItems)}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={renderItem}
            numColumns={1}
            keyExtractor={keyExtractor}
            ListHeaderComponent={listHeaderComponent()}
            onEndReachedThreshold={0.7}
            onEndReached={getMoreSearchResult}
          />
        )}
      </BottomSheet>
    </Container>
  );
});

const SearchButtonContainer = styled.View`
  height: 70px;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  z-index: 100;
`;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const SearchButton = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  justify-content: center;
  border-radius: 2px;
  background-color: #f8f8f8;
  z-index: 100;
  padding: 0 15px 0 15px;
  margin: 0 15px 0 15px;
`;

const SearchText = styled(Text)`
  color: #999;
  font-size: 14px;
`;

const WhiteRow = styled.View<{ top?: number }>`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  z-index: 100;
  margin: ${(props) => (props?.top ? props.top : 0)}px 0 0 0;
`;

const ListButton = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  align-self: center;
  border-bottom-width: 1px;
  border-color: #eee;
  padding: 7.5px 20px 7.5px 20px;
`;

const ProductImg = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 4px;
  margin: 0 15px 0 0;
`;

const ProductRightContainer = styled.View`
  flex: 1;
`;

const PriceLabel = styled(Text)`
  font-size: 13px;
  font-family: ${(props) => props.theme.families.regular};
`;

const Price = styled(Text)`
  font-size: 18px;
  font-family: ${(props) => props.theme.families.bold};
  margin: 0 0 6px 0;
`;

const ProductName = styled(Text)`
  font-size: 15px;
  font-family: ${(props) => props.theme.families.medium};
`;

const Date = styled(Text)`
  color: #999;
  font-size: 12px;
`;

const RegionText = styled(Text)`
  color: #999;
  font-size: 12px;
`;

const CustomMarker = styled.View<{ size: number }>`
  min-width: 30px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  background-color: ${(props) => props.theme.colors.pointColor};
  border-radius: 100px;
  padding: 8px 8px 8px 8px;
`;

const CustomMarkerCountContainer = styled.View`
  min-width: 25px;
  min-height: 25px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background-color: #fff;
  padding: 6px 6px 4px 6px;
  margin: 0 4px 0 0;
`;

const CustomMarkerCount = styled(Text)`
  color: ${(props) => props.theme.colors.pointColor};
  font-size: 13px;
  font-family: ${(props) => props.theme.families.medium};
`;

const CustomMarkerTitle = styled(Text)`
  color: #fff;
  font-size: 13px;
`;

const LocationInfoContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-color: #eee;
  padding: 15px 15px 15px 15px;
`;

const InfoTitle = styled(Text)`
  font-size: 18px;
  font-family: ${(props) => props.theme.families.medium};
  margin: 0 0 10px 0;
`;

const InfoLabelText = styled(Text)`
  color: #4f4f4f;
  font-size: 12px;
`;

const InfoLabelContainer = styled.View`
  background-color: #eee;
  border-radius: 100px;
  padding: 4px 7.5px 4px 7.5px;
  margin: 0 5px 0 0;
`;

const InfoSubtitle = styled(Text)`
  color: #666;
  font-size: 14px;
`;

const MyLocationButton = styled.TouchableOpacity<{ headerViewHeight: number }>`
  width: 35px;
  height: 35px;
  background-color: #fff;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${(props) => (props.headerViewHeight === 120 ? 90 : 220)}px;
  right: 15px;
  z-index: 10;
  elevation: 7;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

const MyLocationButtonIcon = styled.Image`
  width: 21px;
  height: 21px;
  tint-color: #111;
`;

export default MarketSearchMapScreen;
