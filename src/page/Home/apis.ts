import { GenericAbortSignal } from 'axios';
import httpRequest from '@/utils/axios';
import fetchWrapper from '@/utils/fetch';

export const fetchGame = (params?: any, signal?: GenericAbortSignal) =>
  httpRequest.get({ url: '/api/get_game', params, signal });

export const fetchGame2 = (params?: any) =>
  fetchWrapper.get('/api/get_game', params);
