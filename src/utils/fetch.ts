import FetchWrapper from './fetchTool';

const config = {
  timeout: 10000, // 超时时间
  retries: 5, // 重试次数
  retryInterval: 2000, // 重试间隔
  retryOnFail: true, // 开启错误重试
  baseURL: '', // 基础URL
};

const fetchWrapper = new FetchWrapper(config);

// 添加请求拦截器
fetchWrapper.useRequestInterceptor(async options => {
  options.headers = {
    ...options.headers,
    Authorization: 'Bearer token',
  };
  return options;
});

// 添加响应拦截器
fetchWrapper.useResponseInterceptor(
  response => response,
  error => {
    console.error('Response error:', error);
    throw error;
  },
);

// 添加响应拦截器
fetchWrapper.useResponseInterceptor(
  response => response,
  error => {
    console.error('Response error:', error);
    throw error;
  },
);

export default fetchWrapper;
