import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { IImage } from ".";
import * as FileSystem from "expo-file-system";
import { useCallback, useEffect, useState } from "react";
import Icon404 from "../../../assets/images/404.svg";

const dir = FileSystem.cacheDirectory + "images/";

const checkImageInCache = async (uri: string) => {
  try {
    return await FileSystem.getInfoAsync(uri);
  } catch (err) {
    return false;
  }
};

const cacheImage = async (link: string, localUrl: string, callback: any) => {
  try {
    await ensureDirExists(dir);

    const downloadImage = FileSystem.createDownloadResumable(
      link,
      localUrl,
      {
        cache: false,
      },
      callback
    );

    const res = await downloadImage.downloadAsync();
    if (!!res && res?.status === 200) {
      return res.uri;
    } else {
      let imgInCache = await checkImageInCache(localUrl);
      if (!!imgInCache && !!imgInCache?.exists) {
        await FileSystem.deleteAsync(localUrl);
      }
    }

    return false;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

const ensureDirExists = async (dir: string) => {
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
};

export const init = (props: IImage) => {
  const [status, setstatus] = useState("ready");
  const uri = get(props, "source.uri", "");
  let fileName = "";
  let cacheFileUri = `${dir}`;
  if (!!uri) {
    const uripath = uri?.split("/");
    fileName = uripath[uripath.length - 1];
    if (uri.indexOf("file://") === 0) {
      cacheFileUri = uri;
    } else {
      cacheFileUri = `${cacheFileUri}${fileName}`;
    }
  }
  const [imgUrl, setUrl] = useState(`${cacheFileUri}`);

  const init = useCallback(async () => {
    if (typeof props.source === "object" && !!uri && !fileName) {
      setstatus("error");
      return;
    }
    if (
      typeof props.source === "number" ||
      (typeof props.source === "object" &&
        !!uri &&
        uri.indexOf("file://") === 0)
    ) {
      setstatus("ready");
      return;
    }

    let imgInCache = await checkImageInCache(cacheFileUri);
    // if (fileName == "semen_1.png") console.log(imgInCache);

    if (!!uri && (imgInCache === false || !imgInCache?.exists)) {
      setstatus("loading");
      const encodedLink = encodeURI(uri);
      let cached = await cacheImage(encodedLink, cacheFileUri, (e: any) => {});
      if (!!cached) {
        setUrl("");
        setUrl(cached);
      } else {
        setUrl("");
        setstatus("error");
        return;
      }
    }

    setstatus("ready");
  }, []);

  useEffect(() => {
    init();
  }, []);

  return {
    imgUrl,
    status,
  };
};

const getImageProps = (props: IImage, imgUrl: string) => {
  const style = generateStyle(props);
  let source = props.source;
  if (!!imgUrl && typeof props.source !== "number") {
    source = {
      uri: imgUrl,
    };
  }

  return {
    ...props,
    style,
    ref: props.componentRef,
  };
};

export const getWrapperProps = (props: IImage) => {
  const cprops = get(props, "wrapperProps", {});

  return cprops;
};

export const getShimmerProps = (props: IImage) => {
  const cprops: any = get(props, "shimmerProps", {});
  const className = `absolute inset-0 ${cprops?.className || ""}`;

  return {
    cprops,
    className,
    style: parseStyleToObject(cprops.style, className),
  };
};

export const getErrorProps = (props: IImage) => {
  const cprops: any = get(props, "errorProps", {});
  const className = `absolute inset-0 bg-white items-center justify-center ${
    cprops?.className || ""
  }`;
  const name = Icon404;

  return {
    name,
    size: "80%",
    ...cprops,
    className,
  };
};

const generateStyle = (props: IImage) => {
  const style: any = {};
  const className = `w-40 h-40 ${get(props, "className", "")}`;

  Object.assign(style, tailwind(className), parseStyleToObject(props.style));

  return style;
};

export default getImageProps;
