import { useFocusEffect } from "@react-navigation/native";
import { cloneDeep, isNull, isUndefined, merge } from "lodash";
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
  refreshOnFocus?: boolean;
}

export type TFetchCallback<S> = (
  res: any,
  data?: S,
  api?: IAPI
) =>
  | {
      data: S;
      total?: number;
    }
  | undefined
  | void;

export interface IFetchState<S> {
  data: S;
  total: number;
  isReady: boolean;
  isLoading: boolean;
  isRefresh: boolean;
}

export interface IFetchData<S> {
  state: IFetchState<S>;
  setState: React.Dispatch<React.SetStateAction<TFetchData<S>>>;
  fetch: (refresh?: boolean, api?: IAPI) => Promise<any>;
}

export const generatePaging = (
  current_total: number = 0,
  total_data: number = 0,
  limit: number = 100
) => {
  const page = Math.floor(total_data / limit);
  const curr_page = Math.floor(current_total / limit);
  const offset = current_total || 0;

  return {
    can_next: !total_data ? true : curr_page < page,
    current_page: curr_page,
    page: curr_page + 1,
    limit,
    offset,
  };
};

const useFetchData = <S = undefined>(
  initialData: S,
  config: IFetchConfig,
  callback?: TFetchCallback<S>
): IFetchData<S> => {
  const {
    disablePaging,
    disableCache,
    disableFetchOnInit,
    api,
    cacheKey,
    refreshOnFocus,
  } = config;
  const ref = useRef<AbortController>();
  const controller = ref.current;
  const [isReady, setisready] = useState<boolean>(false);
  const [hasCache, sethascache] = useState<boolean | undefined>();
  const [isLoading, setloading] = useState<boolean>(false);
  const [isRefresh, setrefresh] = useState<boolean>(false);
  const [total, settoal] = useState(0);
  const ninitialData = cloneDeep(initialData);
  const [data, setdata] = useState<S>(ninitialData);

  const buildUrl = (_api: IAPI) => {
    const params = api.params || {};
    const _params = _api?.params || {};
    Object.assign(params, _params);
    let url = api.url || "";
    if (!!params) {
      url += "?";
      Object.keys(params).forEach((key, idx) => {
        if (!!params[key]) {
          if (idx > 0) url += "&";
          url += `${key}=${params[key]}`;
        }
      });
    }

    return url;
  };

  const getAPIParams = useCallback(
    (_api: IAPI, refresh: boolean): IAPI => {
      let params: any = {};
      if (!disablePaging && Array.isArray(data)) {
        const { can_next, limit, offset, page } = generatePaging(
          refresh ? 0 : data.length,
          refresh ? 0 : total,
          _api?.params?.limit || api.params?.limit
        );
        if (can_next) {
          Object.assign(params, {
            limit,
            offset,
            page,
          });
        }
      }

      ref.current = new AbortController();
      const apiParams: IAPI = {
        signal: ref.current?.signal,
        method: "GET",
        params,
      };
      merge(apiParams, api, _api);

      Object.keys(apiParams.params).forEach((key) => {
        if (
          isNull(apiParams.params[key]) ||
          isUndefined(apiParams.params[key]) ||
          (Array.isArray(apiParams.params[key]) &&
            !apiParams.params[key].length)
        ) {
          delete apiParams.params[key];
        }
      });

      return apiParams;
    },
    [data, total]
  );

  const loadCache = async () => {
    let url = buildUrl({});
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
      let url = buildUrl({});
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
        const ndata = cloneDeep(state);
        setdata(cloneDeep(ndata.data));
        if (ndata?.total) settoal(ndata?.total);
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

  const fetch = (refresh: boolean, api: IAPI) => {
    return new Promise((resolve, reject) => {
      try {
        const apiParams = getAPIParams(api, refresh);
        console.log("useFetchData: ", apiParams);

        if (isRefresh || isLoading || hasCache === undefined) {
          // reject(`'${apiParams.url}', already runing.`);
          return;
        }
        if (Array.isArray(data) && refresh === false) {
          const { can_next } = generatePaging(data.length, total);
          if (!can_next) {
            // reject(`'${apiParams.url}', Maximum data reached.`);
            return;
          }
        }
        let _isRefresh: boolean = isRefresh,
          _isLoading: boolean = isLoading,
          ndata = refresh ? cloneDeep(initialData) : cloneDeep(data);

        if (refresh) {
          if (!!disableCache || (!disableCache && !hasCache)) {
            _isRefresh = true;
            setrefresh(true);
          }
        } else {
          _isLoading = true;
          setloading(true);
        }

        API(apiParams)
          .then((res) => {
            let rdata = res;
            if (!!callback) {
              let cdata = callback(res, data, apiParams);
              if (!!cdata) {
                rdata = cdata;
              }
            }

            if (!!rdata) {
              let data = rdata.data;
              let ntotal = rdata?.total || 0;
              if (refresh === false && !disablePaging && Array.isArray(ndata)) {
                data = cloneDeep(ndata.concat(data));
              }
              if (data !== undefined) {
                setdata(data);
                saveCache(data, ntotal);
              }
              if (ntotal !== undefined && ntotal !== total) {
                settoal(ntotal);
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
      (refresh: boolean = true, api: IAPI = {}) =>
        fetch(refresh, api),
    [hasCache, data, config]
  );

  useEffect(() => {
    loadCache();

    return () => {
      controller?.abort();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (
        (!disableFetchOnInit && hasCache !== undefined && !refreshOnFocus) ||
        (hasCache !== undefined && isReady && !!refreshOnFocus)
      ) {
        memoFetch(true);
      }
    }, [isReady, hasCache])
  );

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
