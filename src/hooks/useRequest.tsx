import { useRef, useCallback } from "react";
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Request = (
  url: string,
  config?: AxiosRequestConfig
) => Promise<any>;

function useRequest(throwError: boolean = true): {
  request: Request;
} {
  const cancel = useRef<CancelTokenSource>();
  const cache = useRef<{ [url: string]: any }>({});

  const request: Request = useCallback(
    async (url: string, config: AxiosRequestConfig = {}) => {
      if (cancel.current) {
        cancel.current.cancel();
      }
      cancel.current = axios.CancelToken.source();
      const configString: string = JSON.stringify(config);
      const cacheKey: string = configString === "{}" ? url : url + configString;
      try {
        if (cache.current[cacheKey]) {
          return cache.current[cacheKey];
        }
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const res: AxiosResponse<any> = await axios(url, {
          ...config,
          cancelToken: cancel.current.token,
        });
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const result: any = res.data;
        cache.current[cacheKey] = result;
        return result;
      } catch (error) {
        if (!axios.isCancel(error)) {
          if (throwError) {
            throw new Error(error.message);
          } else {
            console.log("Request failed:", error.message);
          }
        }
        return undefined;
      }
    },
    [throwError]
  );

  return { request };
}

export default useRequest;
