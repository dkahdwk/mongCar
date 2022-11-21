export interface RegionDto {
  code?: string;
  address?: string;

  /** @format double */
  latitude?: number;

  /** @format double */
  longitude?: number;
}

export interface RegionCountDto {
  region?: RegionDto;

  /** @format int64 */
  count?: number;
}

export interface UserDto {
  /** @format int32 */
  id?: number;
  uniqueNumber?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  gender?: 'M' | 'F';

  /** @format date */
  birthDate?: string;
  profileImage?: FileDto;
  isActive?: boolean;
  isVerify?: boolean;
  isAdmin?: boolean;
  isDelete?: boolean;

  /** @format int32 */
  myCommunityPostCount?: number;

  /** @format int32 */
  myStoreItemCount?: number;

  /** @format int32 */
  myPropertyCount?: number;

  /** @format int32 */
  myReviewCount?: number;

  /** @format int32 */
  myInquiryCount?: number;

  /** @format date-time */
  createDate?: string;
  verificationCode?: string;
}

export interface FileDto {
  /** @format int32 */
  id?: number;
  fileName?: string;
  fileType?:
    | 'icon'
    | 'profile'
    | 'logo'
    | 'cover'
    | 'business'
    | 'post'
    | 'chat'
    | 'report'
    | 'item'
    | 'property';

  /** @format int64 */
  fileSize?: number;
  contentType?: string;

  /** @format int32 */
  width?: number;

  /** @format int32 */
  height?: number;
  isPublicDownload?: boolean;
  publicUrl?: string;
  thumbnailUrl?: string;
  creator?: UserDto;

  /** @format date-time */
  createDate?: string;

  /** @format date-time */
  modifyDate?: string;
}

export interface ItemDto {
  /** @format int32 */
  id?: number;
  itemType?: string;
  name?: string;
  image?: FileDto;
  images?: FileDto[];
  status?: 'ON_SALE' | 'RESERVED' | 'SOLD';

  /** @format int32 */
  quantity?: number;

  /** @format int32 */
  price?: number;
  description?: string;
  tags?: string[];
  regions?: RegionDto[];
  transactionType?: 'DIRECT' | 'DELIVERY' | 'DIRECT_AND_DELIVERY';
  includeShippingFee?: boolean;

  /** @format int32 */
  shippingFee?: number;
  useSafePayment?: boolean;
  useOffer?: boolean;
  condition?: 'NEW' | 'USED';
  isRefundable?: boolean;

  /** @format int32 */
  weight?: number;

  /** @format int32 */
  width?: number;

  /** @format int32 */
  depth?: number;

  /** @format int32 */
  height?: number;
  option1?: string[];
  option2?: string[];
  option3?: string[];
  option4?: string[];
  etc?: string[];

  /** @format int32 */
  readCount?: number;

  /** @format int32 */
  interestCount?: number;

  /** @format int32 */
  inquiryCount?: number;

  /** @format int32 */
  reviewCount?: number;
  isMyInterest?: boolean;
  isMine?: boolean;

  /** @format int32 */
  marketChatRoomCount?: number;

  /** @format date-time */
  createDate?: string;
}
