// constants/theme.ts
export interface AppColorsType {
  textColor: string;
  button_background: string;
  cursor_color: string;
  button_text: string;
  outline_button: string;
  app_background_2: string;
  text_light: string;
}

export const AppColors: AppColorsType = {
  textColor: '#030000',
  button_background: '#d9382a',
  cursor_color: '#d9382a',
  button_text: '#fff',
  outline_button: '#ed271e',
  app_background_2: '#FFFFF',
  text_light: '#41403c',
};

// Alternative: Individual exports with proper typing
export const CURSOR_COLOR: string = '#d9382a';
export const BUTTON_BACKGROUND: string = '#d9382a';
export const TEXT_COLOR: string = '#030000';
export const BUTTON_TEXT: string = '#000000';
export const TEXT_LIGHT: string = '#41403c';