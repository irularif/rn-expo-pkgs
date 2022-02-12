import { generatePaging } from "app/store/misc";
import { cloneDeep, merge } from "lodash";
import API, { IAPI } from "pkgs/libs/utils/api";
import Storage from "pkgs/libs/utils/storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const storageKey = "fetch-api";

export type TFetchData<S> = {
  data: S;
  total?: number;
};

export interface IFetchConfig {
  api: IAPI;
  disablePaging?: boolean;
  disableCache?: boolean;
  disableFetchOnInit?: boolean;
  cacheKey?: string;
}

export type TFetchCallback<S> = (res: any) =>
  | {
      data: S;
      total?: number;
    }
  | undefined;

export interface IFetchState<S> {
  data: S;
  total: number;
  isReady: boolean;
  isLoading: boolean;
  isRefresh: boolean;
}

const useFetchData = <S = undefined>(
  initialData: S,
  config: IFetchConfig,
  callback?: TFetchCallback<S>
): {
  state: IFetchState<S>;
  setState: React.Dispatch<React.SetStateAction<TFetchData<S>>>;
  fetch: (refresh?: boolean) => Promise<any>;
} => {
  const { disablePaging, disableCache, disableFetchOnInit, api, cacheKey } =
    config;
  const ref = useRef<AbortController>();
  const controller = ref.current;
  const [isReady, setisready] = useState<boolean>(false);
  const [hasCache, sethascache] = useState<boolean | undefined>();
  const [isLoading, setloading] = useState<boolean>(false);
  const [isRefresh, setrefresh] = useState<boolean>(false);
  const [total, settoal] = useState(0);
  const [data, setdata] = useState<S>(cloneDeep(initialData));

  const buildUrl = () => {
    let url = api.url || "";
    if (!!api.params) {
      url += "?";
      Object.keys(api.params).forEach((key, idx) => {
        if (idx > 0) url += "&";
        if (!!api.params[key]) {
          url += `${key}=${api.params[key]}`;
        }
      });
    }

    return url;
  };

  const getAPIParams = (): IAPI => {
    let params = {};
    if (!disablePaging && Array.isArray(data)) {
      const { can_next, limit, offset } = generatePaging(data.length, total);
      if (can_next) {
        params = {
          limit,
          offset,
        };
      }
    }

    ref.current = new AbortController();
    const apiParams: IAPI = {
      signal: ref.current?.signal,
      method: "GET",
      params,
    };
    merge(apiParams, api);
    return apiParams;
  };

  const loadCache = async () => {
    let url = buildUrl();
    let ready = false;
    if (!disableCache) {
      const res = await Storage.get(storageKey);
      const cache: any[] = res || [];
      let exdata = cache.find(
        (x) =>
          (!!cacheKey && cacheKey === x.cacheKey && url === x.url) ||
          (!cacheKey && x.url === url)
      );
      if (!!exdata && !!exdata?.data) {
        if (Array.isArray(initialData) && !Array.isArray(exdata.data)) {
          setdata(cloneDeep(initialData));
        } else {
          setdata(cloneDeep(exdata.data));
        }
        if (!!exdata?.total) {
          settoal(exdata.total);
        }
        if (Array.isArray(exdata?.data) && !exdata.data.length) {
          sethascache(false);
        } else {
          sethascache(true);
          ready = true;
        }
      } else {
        sethascache(false);
      }
    } else {
      sethascache(false);
    }
    if (!!disableFetchOnInit || ready) {
      setisready(true);
    }
  };

  const saveCache = async (data: any, total: number) => {
    if (!disableCache) {
      let url = buildUrl();
      const cache: any[] = (await Storage.get(storageKey)) || [];
      let idx = cache.findIndex(
        (x) =>
          (!!cacheKey && cacheKey === x.cacheKey && url === x.url) ||
          (!cacheKey && x.url === url)
      );
      if (idx > -1) {
        cache[idx].data = data;
        cache[idx].total = total;
      } else {
        cache.push({
          cacheKey,
          url,
          data,
          total,
        });
      }
      Storage.set(storageKey, cache);
    }
  };

  const updateState = useCallback(
    (state: React.SetStateAction<TFetchData<S>>) => {
      if (typeof state === "object") {
        setdata(cloneDeep(data));
      } else if (typeof state === "function") {
        const ndata = state({
          data,
          total,
        });
        setdata(ndata.data);
        if (ndata?.total) settoal(ndata?.total);
      }
    },
    [data, total]
  );

  const fetch = (refresh: boolean) => {
    return new Promise((resolve, reject) => {
      try {
        const apiParams = getAPIParams();
        console.log("useFetchData: ", buildUrl());

        if (isRefresh || isLoading || hasCache === undefined) {
          reject(`'${apiParams.url}', already runing.`);
          return;
        }
        if (Array.isArray(data) && !refresh) {
          const { can_next } = generatePaging(data.length, total);
          if (!can_next) {
            reject(`'${apiParams.url}', Maximum data reached.`);
            return;
          }
        }
        let _isRefresh: boolean = isRefresh,
          _isLoading: boolean = isLoading,
          ndata = refresh ? cloneDeep(initialData) : cloneDeep(data);

        if (refresh) {
          if (!hasCache) {
            _isRefresh = true;
            setrefresh(_isRefresh);
          }
        } else {
          _isLoading = true;
          setloading(_isLoading);
        }

        API(apiParams)
          .then((res) => {
            let rdata = res;
            if (!!callback) {
              rdata = callback(res);
            }

            if (!!rdata) {
              let data = rdata.data;
              const total = rdata.total;
              if (!disablePaging && Array.isArray(ndata)) {
                data = cloneDeep(ndata.concat(data));
              }
              if (data !== undefined) {
                setdata(data);
                saveCache(data, total);
              }
              if (total !== undefined) {
                settoal(total);
              }
            } else if (rdata !== undefined) {
              setdata(rdata);
            }

            resolve(res);
          })
          .catch((e) => {
            reject(e);
          })
          .finally(() => {
            if (_isRefresh) setrefresh(false);
            if (_isLoading) setloading(false);
            if (!isReady) setisready(true);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  const memoFetch = useMemo(
    () =>
      (refresh: boolean = true) =>
        fetch(refresh),
    [hasCache, data]
  );

  useEffect(() => {
    loadCache();

    return () => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    if (!disableFetchOnInit && hasCache !== undefined) {
      memoFetch();
    }
  }, [hasCache]);

  return {
    state: {
      isReady,
      isLoading,
      isRefresh,
      data,
      total,
    },
    setState: updateState,
    fetch: memoFetch,
  };
};

export default useFetchData;
