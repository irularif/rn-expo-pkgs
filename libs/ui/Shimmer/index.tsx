import { LinearGradient } from "expo-linear-gradient";
import { IComponent } from "pkgs/types/global";
import React from "react";
import { Animated, EasingFunction } from "react-native";
import View from "../View";
import { getViewProps, initProps } from "./generateProps";

interface IColor {
  color: string;
  location: number;
}

export interface IShimmer extends IComponent {
  colors?: IColor[];
  duration?: number;
  animateType?: EasingFunction;
}

const Shimmer = (props: IShimmer) => {
  const { viewRef, positionState, linear, colors, locations } =
    initProps(props);
  const [position, _] = positionState;
  const viewProps = getViewProps(props, positionState, viewRef);

  return (
    <View {...viewProps}>
      {!!position.width && (
        <Animated.View
          style={{
            width: position.width,
            height: position.height,
            transform: [{ translateX: linear }],
          }}
        >
          <LinearGradient
            style={{ flex: 1, width: position.width }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={locations}
            colors={colors}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Shimmer;
