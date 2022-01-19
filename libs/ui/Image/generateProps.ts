import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { IImage } from ".";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

const checkImageInCache = async (uri: string) => {
  try {
    return await FileSystem.getInfoAsync(uri);
  } catch (err) {
    return false;
  }
};

const cacheImage = async (link: string, localUrl: string, callback: any) => {
  try {
    const downloadImage = FileSystem.createDownloadResumable(
      link,
      localUrl,
      {},
      callback
    );

    const res = await downloadImage.downloadAsync();
    if (!!res) {
      return res.uri;
    }

    return false;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

const getImageProps = (props: IImage) => {
  const style = generateStyle(props);
  const uri = get(props, "source.uri", "");
  const encodedLink = encodeURI(uri);
  const cacheKey = props.cacheKey || "";
  const [imgUrl, setUrl] = useState(`${FileSystem.cacheDirectory}${cacheKey}`);
  const init = async () => {
    const cacheFileUri = `${FileSystem.cacheDirectory}${cacheKey}`;
    let imgInCache = await checkImageInCache(cacheFileUri);

    if (!!uri && (imgInCache === false || !imgInCache?.exists)) {
      let cached = await cacheImage(encodedLink, cacheFileUri, () => {});
      if (cached) {
        setUrl(`${cacheFileUri}/m`);
        setUrl(cached);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  let source = props.source;
  if (!!uri) {
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

const generateStyle = (props: IImage) => {
  const style: any = {};
  const className = `w-40 h-40 ${get(props, "className", "")}`;

  Object.assign(style, tailwind(className), parseStyleToObject(props.style));

  return style;
};

export default getImageProps;
