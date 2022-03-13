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

export interface IUseFetchData<S> {
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
): IUseFetchData<S> => {
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

  const buildUrl = useCallback(
    (_api: IAPI) => {
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
    },
    [api]
  );

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
    [data, total, api]
  );

  const loadCache = useCallback(async () => {
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
  }, []);

  const saveCache = useCallback(async (data: any, total: number) => {
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
  }, []);

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
    []
  );

  const fetch = useCallback(
    (refresh: boolean = true, api: IAPI = {}) => {
      let _isRefresh: boolean = isRefresh,
        _isLoading: boolean = isLoading,
        ndata = refresh ? cloneDeep(initialData) : cloneDeep(data);

      return new Promise(async (resolve, reject) => {
        try {
          const apiParams = getAPIParams(api, refresh);

          if (isRefresh || isLoading || hasCache === undefined) {
            return;
          }
          if (Array.isArray(data) && refresh === false) {
            const { can_next } = generatePaging(data.length, total);
            if (!can_next) {
              return;
            }
          }

          if (refresh) {
            if (!!disableCache || (!disableCache && !hasCache)) {
              _isRefresh = true;
              setrefresh(true);
            }
          } else {
            _isLoading = true;
            setloading(true);
          }

          // console.log("useFetchData: ", apiParams);
          const res = await API(apiParams);
          let rdata: any = res;
          if (!!callback) {
            rdata = callback(res, data, apiParams);
          }

          let cdata = rdata?.data;
          let ntotal = rdata?.total || 0;
          if (refresh === false && !disablePaging && Array.isArray(ndata)) {
            cdata = cloneDeep(ndata.concat(cdata));
          }
          if (cdata !== undefined) {
            setdata(cdata);
            saveCache(cdata, ntotal);
          }
          if (ntotal !== undefined && ntotal !== total) {
            settoal(ntotal);
          }
          resolve(res);
        } catch (error) {
          reject(error);
        } finally {
          if (_isRefresh) setrefresh(false);
          if (_isLoading) setloading(false);
          if (!isReady) setisready(true);
        }
      });
    },
    [isRefresh, isLoading, callback, data, total, hasCache]
  );

  useEffect(() => {
    loadCache();

    return () => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    if (hasCache !== undefined) {
      if (
        (!disableFetchOnInit && !refreshOnFocus) ||
        (isReady && !!refreshOnFocus)
      ) {
        fetch(true);
      }
    }
  }, [isReady, hasCache]);

  return {
    state: {
      isReady,
      isLoading,
      isRefresh,
      data,
      total,
    },
    setState: updateState,
    fetch,
  };
};

export default useFetchData;
