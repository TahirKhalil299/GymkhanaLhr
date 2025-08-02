// src/api/interceptors/NetworkInterceptor.js

import { NetInfo } from '@react-native-community/netinfo';
import NoConnectivityError from '../errors/NoConnectivityError';

export const networkInterceptor = async (request) => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    throw new NoConnectivityError();
  }
  return request;
};