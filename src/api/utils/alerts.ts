// src/utils/alerts.ts
import { Alert, AlertButton } from 'react-native';

export const showAlert = (
  title: string, 
  message: string, 
  buttons: AlertButton[] = [{ text: 'OK' }]
): void => {
  Alert.alert(title, message, buttons);
}; 