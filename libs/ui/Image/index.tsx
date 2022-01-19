import React, { memo } from "react";
import getImageProps from "./generateProps";
import { Image as RNImage, ImageProps } from "react-native";

export interface IImage extends ImageProps {
  componentRef?: any;
  className?: string;
  cacheKey?: string;
}

const Image = (props: IImage) => {
  const imageProps = getImageProps(props);

  return <RNImage {...imageProps} />;
};

export default memo(Image);
