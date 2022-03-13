import { cloneDeep, merge } from "lodash";
import API, { IAPI } from "pkgs/libs/utils/api";
import uriToFile from "pkgs/libs/utils/uri-to-file";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

export interface IUseFileUpload {
  upload: (uri: string, api?: IAPI) => IFile;
  data: Array<IFile>;
  cancel: (id?: number) => void;
}

export interface IFile {
  id: number;
  uri: string;
  status: "PENDING" | "DONE" | "PROGRESS" | "ERROR" | "ABORTED";
}

interface IFileUpload extends IFile {
  response: any;
  error: any;
  api?: IAPI;
}

enum FileUploadActionType {
  UPDATE,
  ADD,
  DELETE,
  REPLACE,
}

const reducerFileUpload = (
  state: Array<IFileUpload>,
  action: { type: FileUploadActionType; payload: any }
): Array<IFileUpload> => {
  const nstate = cloneDeep(state);
  const idx = nstate.findIndex((x) => x.id === action.payload.id);
  switch (action.type) {
    case FileUploadActionType.UPDATE:
      if (idx > -1) {
        nstate[idx] = { ...nstate[idx], ...action.payload };
      }
      return nstate;
    case FileUploadActionType.ADD:
      nstate.push(action.payload);
      return nstate;
    case FileUploadActionType.DELETE:
      if (idx > -1) {
        nstate.splice(idx, 1);
      }
      return nstate;
    case FileUploadActionType.REPLACE:
      return action.payload;
    default:
      return state;
  }
};

const useFileUpload = (
  field_name: string,
  api: IAPI,
  callback?: (res: any, data?: any, api?: IAPI) => any | undefined | void
): IUseFileUpload => {
  const ref = useRef<AbortController>();
  const controller = ref.current;
  const [data, dispatch] = useReducer(reducerFileUpload, []);
  const [upload, setupload] = useState<IFileUpload | undefined>();

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

  const getAPIParams = useMemo(
    () =>
      (oapi: IAPI = {}): IAPI => {
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

  const run = useCallback(async () => {
    if (upload?.status !== "PENDING") {
      return;
    } else {
      try {
        let file = cloneDeep(upload);
        file.status = "PROGRESS";
        dispatch({
          type: FileUploadActionType.UPDATE,
          payload: file,
        });
        console.log("usePostData: ", buildUrl());
        const fdata = new FormData();
        fdata.append(field_name, uriToFile(file.uri));
        if (!!file.api?.data) {
          Object.keys(file.api?.data).forEach((key) => {
            fdata.append(key, file.api?.data[key]);
          });
        }
        ref.current = new AbortController();
        const apiParams: IAPI = getAPIParams(file.api);
        apiParams.data = fdata;

        const res = await API(apiParams);
        let nres = res;
        if (!!callback) {
          nres = callback(res, file, apiParams);
        }
        file.status = "DONE";
        file.response = nres;
        dispatch({
          type: FileUploadActionType.UPDATE,
          payload: file,
        });
      } catch (error) {
        let file = cloneDeep(upload);
        file.status = "ERROR";
        file.error = error;
        dispatch({
          type: FileUploadActionType.UPDATE,
          payload: file,
        });
      } finally {
        setupload(undefined);
      }
    }
  }, [upload, callback]);

  const onupload = useCallback(
    (uri: string, api: IAPI = {}) => {
      let ndata = cloneDeep(data);
      const idx = ndata.findIndex((item) => item.uri === uri);
      if (idx > -1) {
        return ndata[idx];
      } else {
        let nfile: IFile = {
          id: new Date().getTime(),
          status: "PENDING",
          uri,
        };
        dispatch({
          type: FileUploadActionType.ADD,
          payload: {
            ...nfile,
            response: undefined,
            error: undefined,
            api,
          },
        });
        return nfile;
      }
    },
    [data]
  );

  const oncancel = useCallback(
    (id?: number) => {
      let ndata = cloneDeep(data);
      if (!!id) {
        const file = ndata.find((item) => item.id === id);
        if (!!file) {
          if (upload?.id === id) {
            controller?.abort();
            setupload(undefined);
          }
          file.status = "ABORTED";
          dispatch({
            type: FileUploadActionType.UPDATE,
            payload: file,
          });
        }
      } else {
        ndata = ndata.map((x) => ({
          ...x,
          status: "ABORTED",
        }));
        dispatch({
          type: FileUploadActionType.REPLACE,
          payload: ndata,
        });
        if (!!upload?.id) {
          controller?.abort();
          setupload(undefined);
        }
      }
    },
    [data]
  );

  useEffect(() => {
    if (!!data.length) {
      dispatch({
        type: FileUploadActionType.REPLACE,
        payload: [],
      });
    }
    if (!!upload) {
      setupload(undefined);
    }

    return () => {
      controller?.abort();
      dispatch({
        type: FileUploadActionType.REPLACE,
        payload: [],
      });
      setupload(undefined);
    };
  }, []);

  useEffect(() => {
    if (!upload) {
      let fileConfig = data.find((f) => f.status === "PENDING");
      if (!!fileConfig) {
        setupload(fileConfig);
      }
    } else {
      let idx = data.findIndex((x) => x.id === upload.id);
      if (idx === -1) {
        controller?.abort();
        setupload(undefined);
      }
    }
  }, [data, upload]);

  useEffect(() => {
    run();
  }, [upload]);

  return {
    data,
    upload: onupload,
    cancel: oncancel,
  };
};

export default useFileUpload;
