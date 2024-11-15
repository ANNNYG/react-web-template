export type Config = {
  timeout?: number; // 请求超时时间
  retries?: number; // 请求超时重试次数
  retryInterval?: number; // 添加重试间隔时间参数
  retryOnFail?: boolean; // 是否开启错误重试
  baseURL?: string; // 基础URL
};

export interface RequestOptions extends RequestInit {
  _timeout?: number;
  _retries?: number;
  _retryOnFail?: boolean;
  _retryInterval?: number;
  _apiUrl?: string;
}

export interface InterceptorManager<T> {
  fulfilled: (value: T) => T | Promise<T>;
  rejected?: (error: any) => any;
}
