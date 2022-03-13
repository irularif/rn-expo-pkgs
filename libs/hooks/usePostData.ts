import Constants from "expo-constants";
import { cloneDeep, get, merge } from "lodash";
import API, { IAPI } from "pkgs/libs/utils/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const usePostData = <S = undefined>(
  initialData: S,
  api: IAPI,
  callback?: (res: any, data?: any, api?: IAPI) => any | undefined | void
): {
  isLoading: boolean;
  submit: (api?: IAPI) => Promise<any>;
  data: S;
  setdata: React.Dispatch<React.SetStateAction<S>>;
} => {
  const ref = useRef<AbortController>();
  const controller = ref.current;
  const [data, setdata] = useState<S>(cloneDeep(initialData));
  const [isLoading, setloading] = useState(false);

  const buildUrl = useMemo(
    () => () => {
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
    },
    [api]
  );

  const getAPIParams = useMemo(
    () =>
      (oapi: IAPI): IAPI => {
        ref.current = new AbortController();
        const apiParams: IAPI = {
          signal: ref.current?.signal,
          method: "POST",
        };
        merge(apiParams, api, oapi);
        return apiParams;
      },
    [api]
  );

  const updateData = (data: any) => {
    setdata(cloneDeep(data));
  };

  const submit = useCallback(
    (api: IAPI = {}) => {
      return new Promise(async (resolve, reject) => {
        try {
          const ndata = !!api?.data ? api.data : cloneDeep(data);
          setloading(true);
          ref.current = new AbortController();
          const apiParams: IAPI = getAPIParams(api);
          apiParams.data = ndata;

          console.log("usePostData: ", buildUrl());
          const res = await API(apiParams);
          let nres = res;
          if (!!callback) {
            let cres: any = callback(res, data, apiParams);
            if (!!cres) {
              nres = cres;
            } else {
              nres = data;
            }
          }
          if (nres !== undefined && nres !== null) {
            setdata(nres);
          }
          resolve(res);
        } catch (error) {
          reject(error);
        } finally {
          setloading(false);
        }
      });
    },
    [data]
  );

  useEffect(() => {
    return () => {
      controller?.abort();
    };
  }, []);

  return {
    isLoading,
    data,
    submit,
    setdata: updateData,
  };
};

export default usePostData;
