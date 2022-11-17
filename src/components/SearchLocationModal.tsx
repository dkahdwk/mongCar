/* eslint-disable max-len */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, TextInput, Alert, KeyboardEvent, Keyboard, FlatList } from 'react-native';
import { showToast } from 'utils/DialogHelper';
import { useStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import GetPaddingBottom from 'utils/ContainerPaddingBottomHelper';
import DEVICE_SCREEN from 'utils/ConstantsHelper';
import styled from 'styled-components/native';
import MapService from 'services/MapService';
import Config from 'react-native-config';
import Text from 'components/Text';
import axios from 'axios';

const SearchLocationModal = observer(() => {
  const { mapStore, uiStore } = useStore();
  const searchInputRef = useRef<TextInput>(null);
  const [value, setValue] = useState<string>('');
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const keyExtractor = useCallback((item: any, index: number) => index.toString(), []);

  const init = async () => {
    const isGranted = await MapService.getGeolocationPermission({ isShownConfirm: true });

    try {
      if (isGranted) {
        MapService.getCurrentLocation(async (position) => {
          const reverseGeocodingResponse = await MapService.reverseGeocoding(
            String(position.coords.longitude),
            String(position.coords.latitude),
            'admcode',
          );
          const region = reverseGeocodingResponse?.results[0]?.region;
          const address = `${region?.area1.name} ${region?.area2.name} ${region?.area3.name}`;
          handleSearchAddress(address);
        });
      }
    } catch (e: any) {
      showToast({
        text: e?.error?.data?.errorMessage,
        type: 'error',
        subText: e?.error?.data?.errorMessage,
      });
      console.log(e);
    }
  };

  const autofocusInput = () => {
    /**
     * Modal의 형태로 사용시, TextInput의 autoFocus가 작동하지 않아 아래 구문 추가
     * setTimeout없이 사용시, 키보드가 올라오지 않음
     */
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 200);
  };

  const savMapInfo = async (response: any) => {
    /** 검색한 결과의 뎁스가  */
    if (typeof response !== 'undefined') {
      if (typeof response?.[0]?.address !== 'undefined') {
        mapStore.setSingleRoadAddress(response?.[0]?.address);
        uiStore.modal.apply(response?.[0]);
      }
    } else {
      return Alert.alert('실패', '지역은 동 혹은 면까지 입력해주세요!');
    }
  };

  // google geocoding
  const geocodingQuery = async (addressInfo: any) => {
    const address = addressInfo.description?.replace('대한민국', '')?.trim();
    const geocoderQuery = encodeURIComponent(address.replace(/ /g, '+'));
    return axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${geocoderQuery}&key=${Config.GOOGLE_MAP_SERVICE_KEY}`,
      )
      .then((res) => res.data)
      .then(async (json) => {
        if (json.results.length === 0) {
          return null;
        }

        const coord = json.results?.[0]?.geometry?.location;

        // naver reverseGeocoding, 좌표로 행정동 변환
        await MapService.reverseGeocoding(String(coord?.lng), String(coord?.lat), 'admcode').then(
          async (result) => {
            const region = result?.results?.[0]?.region?.area1;
            const area = result?.results?.[0]?.region?.area2;
            const dong = result?.results?.[0]?.region?.area3;

            const reverseGeocodingAddress = [region.name, area.name, dong.name].join(' ');

            const geocoding = await MapService.geocoding(reverseGeocodingAddress, {
              filter: 'BCODE',
            });

            const geocodingLongitude = geocoding.addresses[0].x;
            const geocodingLatitude = geocoding.addresses[0].y;

            // return savMapInfo(response);
          },
        );
      })
      .catch((e) => {
        return false;
      });
  };

  // 주소로 검색
  const handleSearchAddress = async (currentAddress: string) => {
    if (currentAddress !== '') {
      // google maps api
      const config: any = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${currentAddress}&language=ko&components=country:kr&key=${Config.GOOGLE_MAP_SERVICE_KEY}`,
        headers: {},
      };

      axios(config)
        .then((response) => {
          // 검색한 내용을 리스트로 출력한다.
          mapStore.setGoogleRegions(response.data?.predictions);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  /** 지역 검색 결과 선택 */
  const handleSelectAddress = async (item: any) => {
    await geocodingQuery(item);
  };

  const listEmptyComponent = () => {
    return (
      <View>
        <Text>해당 지역 정보가 없습니다.</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <ListButton onPress={() => handleSelectAddress(item)}>
        <MapIcon source={require('assets/images/map_pin_line.png')} />
        <ListText numberOfLines={2}>{item?.description?.replace('대한민국', '')?.trim()}</ListText>
      </ListButton>
    );
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardHeight(Math.round(e.endCoordinates.height));
    });
    const keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    init();
    autofocusInput();
  }, []);

  return (
    <Container>
      <TextInput
        ref={searchInputRef}
        value={value}
        onChangeText={(value) => {
          setValue(value);
          handleSearchAddress(value);
        }}
        placeholder={'지역명을 입력해주세요'}
      />
      {/* FlatListContainer는 반드시 필요. modal안에 flatlist가 높이를 인식못함 */}
      <FlatListContainer>
        <FlatList
          style={{ flex: 1, marginTop: 15 }}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            flexGrow: mapStore?.googleRegions?.length === 0 ? 1 : 0,
            paddingBottom: GetPaddingBottom(keyboardHeight),
          }}
          data={mapStore.googleRegions}
          renderItem={renderItem}
          ListEmptyComponent={listEmptyComponent}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.7}
        />
      </FlatListContainer>
    </Container>
  );
});

const Container = styled.View`
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 15px 15px 0 15px;
`;

const ListButton = styled.TouchableOpacity`
  height: 45px;
  flex-direction: row;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 100px;
  padding: 0 12px 0 12px;
  margin: 0 0 10px 0;
`;

const ListText = styled(Text)`
  flex: 1;
  font-size: 14px;
  font-family: ${(props) => props.theme.families.light};
`;

const MapIcon = styled.Image`
  width: 15px;
  height: 17px;
  margin: 0 4px 0 0;
`;

const FlatListContainer = styled.View`
  height: ${DEVICE_SCREEN.height - 200}px;
`;

export default SearchLocationModal;
