import 'styled-components/native';

// styled-components안에 들어있는 DefaultTheme 형식 지정해주기
declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      pointColor: string;
      defaultTextColor: string;
      borderColor: string;
      bgColor: string;
    };
    defaultFont: {
      color: string;
      fontSize: number;
    };
    families: {
      light: string;
      regular: string;
      medium: string;
      bold: string;
      black: string;
      thin: string;
    };
  }
}
