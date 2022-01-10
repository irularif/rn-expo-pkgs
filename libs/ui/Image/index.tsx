import React from "react";
import getImageProps from "./generateProps";
import { Image as RNImage, ImageProps } from "react-native";
// @ts-ignore
import ExpoFastImage from "expo-fast-image";

export interface IImage extends ImageProps {
  componentRef?: any;
  className?: string;
}

const Image = (props: IImage) => {
  const imageProps = getImageProps(props);

  return <ExpoFastImage {...imageProps} />;
};

export default Image;
