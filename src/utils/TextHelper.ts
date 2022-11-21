// 숫자만 입력하게 한다. (TextInput 숫자만 입력할때 유용)
export const onlyNumber = (value: string) => {
  return value.replace(/[^0-9]/g, '').trim();
};

// 숫자만 입력하게 하며, 첫째,둘째 자리 둘다 0일 경우 허용하지 않는다 ex) 00323 이런경우
export const excludingZeroNumber = (value: string) => {
  if (value.length > 1) {
    /**
     * 값 앞에 01 이런식으로 입력한 경우에 앞의 0을 없앤다 (/^0+/ 정규식 활용)
     * value.length > 1 조건부는 딱 '0'을 입력한 즉, 1자리만 입력은 허용하기 위해서
     * */
    const newValue = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
    return newValue.trim();
  } else {
    return value.replace(/[^0-9]/g, '').trim();
  }
};

/**
 * @param value 입력값
 * @param decimalLength 소수점 자리수
 * */
export const toLimitDecimalPoint = (value: string, decimalLength: number) => {
  if (
    value.split('.').length - 1 < 2 &&
    (value.split('.')?.[1]?.length < decimalLength + 1 ||
      typeof value.split('.')?.[1] === 'undefined')
  ) {
    return true;
  }
};

// 숫자에 천단위로 콤마를 입력시킨다. (TextInput 가격 입력할때 유용)
export const commaToPrice = (value: string | number | undefined) => {
  if (typeof value === 'undefined') {
    return '';
  } else if (typeof value === 'number') {
    const formatted = String(value);
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else if (typeof value === 'string') {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '';
  }
};

// 휴대폰 정규식
export const phoneFormat = (value: string | number | undefined) => {
  if (typeof value === 'undefined') return '';
  if (typeof value === 'number') {
    return String(value).replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
  } else {
    return value.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
  }
};
