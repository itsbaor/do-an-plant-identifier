import {MD3LightTheme as DefaultTheme, useTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary_light: '#E3EFDE',
    primary: '#32A05F',
    primary_dark: '#4B6D4E',
    border_gray: '#D9D9D9',
    border_green_opacity: 'rgba(75, 109, 78, 0.3)',
    tabFocus: '#32A05F',
    tabNotFocus: '#A0A0A0',
    topTabFocus: '#FFFFFF',
    topTabNotFocus: '#000000',
    bg_main: '#F8F8F8',
    bg_white: '#FFFFFF',
    bg_black: '#000000',
    text_white: '#FFFFFF',
    text_black: '#000000',
    text_error: '#E51818',
    text_gray_home: '#0000008C',
    bg_box_selected_gray: 'rgba(217, 217, 217, 0.26)',
    bg_box_unselected_gray: 'rgba(9, 15, 5, 0)',
    border_unselected_gray: 'rgba(160, 160, 160, 0.38)',
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();
