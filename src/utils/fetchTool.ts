import Qs from 'qs';

import type { InterceptorManager, RequestOptions, Config } from './fetchType';

const addHeader = (header: any, key: string, value: string) => {
  header.append(key, value);
};

export default class FetchWrapper {
  private timeout: number;
  private retries: number;
  private baseUrl: string;
  private retryInterval: number;
  private retryOnFail: boolean;
  private responseInterceptors: InterceptorManager<Response>[] = [];
  private requestInterceptors: InterceptorManager<RequestOptions>[] = [];

  constructor(config: Config) {
    this.timeout = config.timeout || 5000;
    this.retries = config.retries || 3;
    this.baseUrl = config.baseURL || '';
    this.retryInterval = config.retryInterval || 10000;
    this.retryOnFail =
      config.retryOnFail !== undefined ? config.retryOnFail : false;
  }

  // 添加请求拦截方法
  useRequestInterceptor(
    fulfilled: (
      options: RequestOptions,
    ) => RequestOptions | Promise<RequestOptions>,
    rejected?: (error: any) => any,
  ) {
    this.requestInterceptors.push({ fulfilled, rejected });
  }

  // 添加响应拦截方法
  useResponseInterceptor(
    fulfilled: (response: Response) => Response | Promise<Response>,
    rejected?: (error: any) => any,
  ) {
    this.responseInterceptors.push({ fulfilled, rejected });
  }

  private async applyInterceptors<T>(
    value: T,
    interceptors: InterceptorManager<T>[],
  ) {
    for (const interceptor of interceptors) {
      if (interceptor.fulfilled) {
        try {
          value = await interceptor.fulfilled(value);
        } catch (error) {
          if (interceptor.rejected) {
            value = interceptor.rejected(error);
            break;
          }
          throw error;
        }
      }
    }
    return value;
  }

  // 具有超时功能的fetch
  private async fetchWithTimeout(resource: string, options: RequestOptions) {
    const timeout =
      options._timeout !== undefined ? options._timeout : this.timeout;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    options.signal = controller.signal;

    const finalResource =
      options._apiUrl === undefined
        ? this.baseUrl + resource
        : options._apiUrl + resource;

    try {
      const response = await fetch(finalResource, options);
      clearTimeout(id);
      return response;
    } catch (error) {
      throw new Error('Request timed out');
    }
  }

  // 重试逻辑
  private async retryFetch(
    resource: string,
    options: RequestOptions,
  ): Promise<Response> {
    const retries =
      options._retries !== undefined ? options._retries : this.retries;

    let interval =
      options._retryInterval !== undefined
        ? options._retryInterval
        : this.retryInterval;

    for (let i = 0; i <= retries; i++) {
      try {
        const response = await this.fetchWithTimeout(resource, options);

        if (!response.ok) {
          const status = response.status;
          if (status >= 500) {
            throw new Error(`Network response was not ok: ${status}`);
          } else if (status === 429) {
            if (response.headers.has('Retry-After')) {
              // 使用服务器指定的重试时间
              interval =
                parseInt(response.headers.get('Retry-After')!, 10) * 1000;
            }
            throw new Error(`Rate Limit Exceeded: ${status}`);
          }
        }
        return response;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed: ${(error as Error).message}`);
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, interval));
        } else {
          throw error;
        }
      }
    }
    throw new Error('Maximum retries exceeded');
  }

  async request(
    resource: string,
    options: RequestOptions = {},
  ): Promise<Response> {
    const retryOnFail =
      options._retryOnFail !== undefined
        ? options._retryOnFail
        : this.retryOnFail;

    options = await this.applyInterceptors(options, this.requestInterceptors);

    if (!retryOnFail) {
      try {
        const response = await this.fetchWithTimeout(resource, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await this.applyInterceptors(
          response,
          this.responseInterceptors,
        );
      } catch (error) {
        for (const interceptor of this.responseInterceptors) {
          if (interceptor.rejected) {
            try {
              return await interceptor.rejected(error);
            } catch (newError) {
              console.error(newError);
              throw newError;
            }
          }
        }
        throw error;
      }
    }

    try {
      const response = await this.retryFetch(resource, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await this.applyInterceptors(response, this.responseInterceptors);
    } catch (error) {
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.rejected) {
          try {
            return await interceptor.rejected(error);
          } catch (newError) {
            console.error(newError);
            throw newError;
          }
        }
      }
      throw error;
    }
  }

  async get<T>(resource: string, params: T, options: RequestOptions = {}) {
    const defaultOptions = { method: 'GET' };
    options = Object.assign(defaultOptions, options);
    const url = `${resource}?${Qs.stringify(params)}`;
    return this.request(url, options)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }

  async post(resource: string, body: any, options: RequestOptions = {}) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const defaultOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    };
    options = Object.assign(defaultOptions, options);

    if (options.headers) {
      const optionHeaders = options.headers;
      if (optionHeaders instanceof Headers) {
        optionHeaders.forEach((value, key) => {
          addHeader(headers, key, value);
        });
      } else if (Array.isArray(optionHeaders)) {
        optionHeaders.forEach(header => {
          if (header.length === 2) {
            addHeader(headers, header[0], header[1]);
          }
        });
      } else {
        Object.entries(optionHeaders).forEach(([key, value]) => {
          addHeader(headers, key, value);
        });
      }
    }
    options.headers = headers;
    return this.request(resource, options)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }
}
