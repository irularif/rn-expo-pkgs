import { useIsFocused } from "@react-navigation/native";
import { get } from "lodash";
import { trimObject } from "pkgs/libs/utils/misc";
import { getColor } from "pkgs/libs/utils/styles";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { IShimmer } from ".";
import { IView } from "../View";

const START = -1;
const END = 1;
const DURATION = 2000;

export const initProps = (props: IShimmer) => {
  const isFocused = useIsFocused();
  const positionState = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });
  const viewRef = useRef();
  const [position, _] = positionState;
  const ANIMATION = useRef(new Animated.Value(START)).current;

  const runAnimation = (config: Partial<Animated.TimingAnimationConfig>) => {
    ANIMATION.setValue(START);
    Animated.timing(ANIMATION, {
      ...config,
      toValue: END,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        runAnimation(config);
      }
    });
  };

  const linear = ANIMATION.interpolate({
    inputRange: [START, END],
    outputRange: [-position.width, position.width],
  });

  const _colors = get(props, "colors", [
    {
      color: getColor("gray-200"),
      location: 0,
    },
    {
      color: getColor("gray-300"),
      location: 0.4,
    },
    {
      color: getColor("gray-300"),
      location: 0.6,
    },
    {
      color: getColor("gray-200"),
      location: 1,
    },
  ]);
  const colors = _colors.map((x) => x.color);
  const locations = _colors.map((x) => x.location);

  useEffect(() => {
    if (isFocused && position.width) {
      runAnimation({
        duration: get(props, "duration", DURATION),
        easing: get(props, "animateType", Easing.linear),
      });
    } else if (!isFocused) {
      ANIMATION.stopAnimation();
    }
  }, [position.width, isFocused]);

  return {
    viewRef,
    positionState,
    linear,
    colors,
    locations,
  };
};

export const getViewProps = (
  props: IShimmer,
  positionState: any,
  viewRef: any
) => {
  const [_, setPosition] = positionState;
  const cprops = trimObject(props, ["colors", "duration", "animateType"]);

  const onLayout = () => {
    if (viewRef.current) {
      viewRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          setPosition({
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          });
        }
      );
    }
  };

  const className = `bg-gray-200 rounded overflow-hidden ${
    props.className || ""
  }`;

  return {
    ...cprops,
    className,
    componentRef: viewRef,
    onLayout,
  } as IView;
};
