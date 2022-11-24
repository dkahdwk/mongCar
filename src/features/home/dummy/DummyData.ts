/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { ItemDto, RegionCountDto } from 'features/home/dummy/DummyDto';

export const mapMakers: RegionCountDto[] = [
  {
    count: 17,
    region: {
      address: '서울특별시 성동구 성수1가1동',
      code: '1120065000',
      latitude: 37.542108,
      longitude: 127.04965,
    },
    items: {
      condition: 'USED',
      createDate: '2022-10-20T10:30:27',
      id: 391,
      image: {
        uri: 'https://www.shutterstock.com/image-photo/mountains-during-sunset-beautiful-natural-600w-407021107.jpg',
      },
      includeShippingFee: true,
      marketChatRoomCount: 0,
      name: 'ㅇㅇㅇ6',
      price: 1333,
      quantity: 1,
      regions: [
        {
          address: '서울특별시 성동구 성수2가3동',
          code: 1120069000,
          latitude: 37.5482223,
          longitude: 127.0552645,
        },
        {
          address: '서울특별시 동대문구 장안2동',
          code: 1123066000,
          latitude: 37.578483,
          longitude: 127.0706,
        },
        {
          address: '서울특별시 광진구 광장동',
          code: 1121581000,
          latitude: 37.546892,
          longitude: 127.103025,
        },
      ],
      status: 'ON_SALE',
      transactionType: 'DELIVERY',
      useOffer: false,
      useSafePayment: true,
    },
  },
  {
    count: 12,
    region: {
      address: '서울특별시 성동구 성수2가3동',
      code: '1120069000',
      latitude: 37.5482223,
      longitude: 127.0552645,
    },
  },
  {
    count: 2,
    region: {
      address: '서울특별시 광진구 화양동',
      code: '1121571000',
      latitude: 37.5465421,
      longitude: 127.0713152,
    },
  },
  {
    count: 1,
    region: {
      address: '서울특별시 광진구 광장동',
      code: '1121581000',
      latitude: 37.546892,
      longitude: 127.103025,
    },
  },
  {
    count: 1,
    region: {
      address: '서울특별시 동대문구 장안2동',
      code: '1123066000',
      latitude: 37.578483,
      longitude: 127.0706,
    },
  },
];

const mapItems = [
  {
    condition: 'USED',
    createDate: '2022-10-20T10:30:27',
    id: 391,
    image: {
      uri: 'https://www.shutterstock.com/image-photo/mountains-during-sunset-beautiful-natural-600w-407021107.jpg',
    },
    includeShippingFee: true,
    marketChatRoomCount: 0,
    name: 'ㅇㅇㅇ6',
    price: 1333,
    quantity: 1,
    regions: [
      {
        address: '서울특별시 성동구 성수2가3동',
        code: 1120069000,
        latitude: 37.5482223,
        longitude: 127.0552645,
      },
      {
        address: '서울특별시 동대문구 장안2동',
        code: 1123066000,
        latitude: 37.578483,
        longitude: 127.0706,
      },
      {
        address: '서울특별시 광진구 광장동',
        code: 1121581000,
        latitude: 37.546892,
        longitude: 127.103025,
      },
    ],
    status: 'ON_SALE',
    transactionType: 'DELIVERY',
    useOffer: false,
    useSafePayment: true,
  },
];
