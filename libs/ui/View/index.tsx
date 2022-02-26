import { IComponent } from "../../../types/global";
import React from "react";
import { Animated, View as RNView } from "react-native";
import Text, { IText } from "../Text";
import getViewProps, { getTextProps } from "./generateProps";

export interface IView extends IComponent {
  textProps?: IText;
  type?: "default" | "animated";
}

const AnimatedView = Animated.createAnimatedComponent(RNView);

const View = (props: IView) => {
  const Component = props.type === "animated" ? AnimatedView : RNView;
  const viewProps = getViewProps(props);

  return (
    <Component {...viewProps}>
      <RenderChildren {...props} />
    </Component>
  );
};

const RenderChildren = (props: IView) => {
  if (typeof props.children === "string") {
    const textProps = getTextProps(props);
    return <Text {...textProps} />;
  }

  if (!!props.children) {
    return props.children;
  }

  return null;
};

export default View;
