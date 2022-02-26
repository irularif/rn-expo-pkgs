import React, { memo } from "react";
import getImageProps, {
  getErrorProps,
  getShimmerProps,
  getWrapperProps,
  init,
} from "./generateProps";
import { Image as RNImage, ImageProps } from "react-native";
import View, { IView } from "../View";
import Shimmer, { IShimmer } from "../Shimmer";
import Icon, { IIcon } from "../Icon";

export interface IImage extends ImageProps {
  componentRef?: any;
  className?: string;
  cacheKey?: string;
  wrapperProps?: IView;
  shimmerProps?: IShimmer;
  errorProps?: IIcon;
}

const Image = (props: IImage) => {
  const { imgUrl, status } = init(props);
  const imageProps = getImageProps(props, imgUrl);
  const wrapperProps = getWrapperProps(props);

  return (
    <View {...wrapperProps}>
      <RNImage {...imageProps} />
      <RenderStatus {...props} status={status} />
    </View>
  );
};

const RenderStatus = (props: any) => {
  const shimmerProps = getShimmerProps(props);
  const errorProps = getErrorProps(props);

  if (props.status === "loading") {
    return <Shimmer {...shimmerProps} />;
  } else if (props.status === "error") {
    return <Icon {...errorProps} />;
  }

  return null;
};

export default memo(Image);
