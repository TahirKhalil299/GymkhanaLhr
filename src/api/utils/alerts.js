// src/utils/alerts.js
import { Alert } from 'react-native';

export const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  Alert.alert(title, message, buttons);
};