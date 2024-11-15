import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
} from 'axios';

import { BASE_URL } from '@/common/common';

interface ResponseModal<T = any> {
  success: boolean;
  message: string | null;
  code: number | string;
  data: T;
}

class HttpRequest {
  service: AxiosInstance;
  constructor() {
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 10 * 1000,
    });

    // 请求拦截
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(config);
        return config;
      },
      (error: AxiosError) => {
        console.log('requestError:', error);
        return Promise.reject(error);
      },
      {
        // 是否为同步
        synchronous: false,
        // 当runWhen返回true则执行作用在本次请求上的拦截器方法
        runWhen: (config: InternalAxiosRequestConfig) => {
          return true;
        },
      },
    );

    // 响应拦截
    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModal>): AxiosResponse['data'] => {
        const { data } = response;
        const { code } = data;

        return !code || code !== HttpStatusCode.Ok
          ? Promise.reject(data.message)
          : data;
      },
      (error: AxiosError) => {
        console.log('responseError:', error);
        return Promise.reject(error);
      },
    );
  }

  request<T = any>(config: AxiosRequestConfig): Promise<ResponseModal<T>> {
    return new Promise((resolve, reject) => {
      try {
        this.service
          .request<ResponseModal<T>>(config)
          .then((res: AxiosResponse['data']) => {
            resolve(res as ResponseModal);
          })
          .catch(err => {
            reject(err);
          });
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  get<T = any>(config: AxiosRequestConfig): Promise<ResponseModal<T>> {
    return this.request({ method: 'GET', ...config });
  }
  post<T = any>(config: AxiosRequestConfig): Promise<ResponseModal<T>> {
    return this.request({ method: 'POST', ...config });
  }
  put<T = any>(config: AxiosRequestConfig): Promise<ResponseModal<T>> {
    return this.request({ method: 'PUT', ...config });
  }
  delete<T = any>(config: AxiosRequestConfig): Promise<ResponseModal<T>> {
    return this.request({ method: 'DELETE', ...config });
  }
}

const httpRequest = new HttpRequest();

export default httpRequest;
