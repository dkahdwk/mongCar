import Text from 'components/Text';
import styled from 'styled-components/native';

// 가장 기본이 되는 최상위 View 컨테이너
export const CommonContainer = styled.View`
  flex: 1;
  background-color: white;
`;

// flex-direction: row 형태의 기본 (각 margin을 props로 받을 수 있다.)
export const CommonRow = styled.View<{
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
}>`
  flex-direction: row;
  align-items: center;
  margin: ${(props) => (props?.marginTop ? props?.marginTop : 0)}px
    ${(props) => (props?.marginRight ? props?.marginRight : 0)}px
    ${(props) => (props?.marginBottom ? props?.marginBottom : 0)}px
    ${(props) => (props?.marginLeft ? props?.marginLeft : 0)}px;
`;

export const CommonBetweenRow = styled.View<{
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: ${(props) => (props?.marginTop ? props?.marginTop : 0)}px
    ${(props) => (props?.marginRight ? props?.marginRight : 0)}px
    ${(props) => (props?.marginBottom ? props?.marginBottom : 0)}px
    ${(props) => (props?.marginLeft ? props?.marginLeft : 0)}px;
`;

// 선에 대한 컴포넌트 (예: ------------ 이런 형태. 점선은 아님)
export const CommonDivider = styled.View<{ marginVertical: number; borderColor?: string }>`
  border-top-width: 1px;
  border-color: ${(props) => props.borderColor || '#eee'};
  ${(props) =>
    typeof props.marginVertical !== 'undefined'
      ? `${props.marginVertical}px 0 ${props.marginVertical}px 0`
      : `0 15px 0 15px`}
`;

// 각 하단 탭의 메인 헤더 타이틀에 해당하는 스타일
export const CommonMainHeaderTitle = styled(Text)<{ color?: string }>`
  color: ${(props) => (props?.color ? props?.color : '#fff')};
  font-size: 18px;
  font-family: ${(props) => props.theme.families.medium};
`;

export const CommonText = styled(Text)<{
  color?: string;
  size?: number;
  family?: 'light' | 'medium' | 'bold' | 'black' | 'thin';
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
}>`
  color: ${(props) => props?.color || '#111'};
  font-size: ${(props) => props?.size || 14}px;
  ${(props) => props?.family === 'light' && `font-family: ${props.theme.families.light}`};
  ${(props) => props?.family === 'medium' && `font-family: ${props.theme.families.medium}`};
  ${(props) => props?.family === 'bold' && `font-family: ${props.theme.families.bold}`};
  ${(props) => props?.family === 'black' && `font-family: ${props.theme.families.black}`};
  ${(props) => props?.family === 'thin' && `font-family: ${props.theme.families.thin}`};
  margin: ${(props) => (props?.marginTop ? props?.marginTop : 0)}px
    ${(props) => (props?.marginRight ? props?.marginRight : 0)}px
    ${(props) => (props?.marginBottom ? props?.marginBottom : 0)}px
    ${(props) => (props?.marginLeft ? props?.marginLeft : 0)}px;
`;

// (flatList) ItemSeparatorComponent 에 쓰이는 공용 스타일
export const CommonListLine = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-color: ${(props) => props.theme.colors.borderColor};
`;
