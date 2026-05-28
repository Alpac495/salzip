import type { ImageSourcePropType } from 'react-native';

// Metro 번들러는 require() 경로가 정적이어야 합니다 — 동적 생성 불가

export const VILLA_IMAGES: ImageSourcePropType[] = [
  require('../../assets/images/listings/villa/villa1.webp'),
  require('../../assets/images/listings/villa/villa2.webp'),
  require('../../assets/images/listings/villa/villa3.webp'),
  require('../../assets/images/listings/villa/villa4.webp'),
  require('../../assets/images/listings/villa/villa5.webp'),
];

export const OFFICETEL_IMAGES: ImageSourcePropType[] = [
  require('../../assets/images/listings/officetel/officetel1.webp'),
  require('../../assets/images/listings/officetel/officetel2.webp'),
  require('../../assets/images/listings/officetel/officetel3.webp'),
  require('../../assets/images/listings/officetel/officetel4.webp'),
  require('../../assets/images/listings/officetel/officetel5.webp'),
];

export const ONEROOM_IMAGES: ImageSourcePropType[] = [
  require('../../assets/images/listings/oneroom/oneroom1.webp'),
  require('../../assets/images/listings/oneroom/oneroom2.webp'),
  require('../../assets/images/listings/oneroom/oneroom3.webp'),
  require('../../assets/images/listings/oneroom/oneroom4.webp'),
  require('../../assets/images/listings/oneroom/oneroom5.webp'),
];

// 매물 id → 썸네일 (리스트·마이페이지용)
export const LISTING_THUMBNAIL: Record<string, ImageSourcePropType> = {
  '1':   VILLA_IMAGES[0],
  '2':   OFFICETEL_IMAGES[0],
  '3':   VILLA_IMAGES[1],
  '4':   VILLA_IMAGES[2],
  '5':   OFFICETEL_IMAGES[1],
  'l-1': VILLA_IMAGES[3],
  'l-2': OFFICETEL_IMAGES[2],
  'l-3': VILLA_IMAGES[1],
};

// 매물 id → 상세 이미지 배열 (상세 페이지용)
export const LISTING_DETAIL_IMAGES: Record<string, ImageSourcePropType[]> = {
  '1': [VILLA_IMAGES[0], VILLA_IMAGES[1], VILLA_IMAGES[2]],
  '2': [OFFICETEL_IMAGES[0], OFFICETEL_IMAGES[1], OFFICETEL_IMAGES[2]],
  '3': [VILLA_IMAGES[1], VILLA_IMAGES[2], VILLA_IMAGES[3]],
  '4': [ONEROOM_IMAGES[0], ONEROOM_IMAGES[1], ONEROOM_IMAGES[2]],
  '5': [OFFICETEL_IMAGES[1], OFFICETEL_IMAGES[2], OFFICETEL_IMAGES[3]],
};
