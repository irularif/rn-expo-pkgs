import { useFocusEffect } from "@react-navigation/core";
import { trimObject } from "../../utils/misc";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  TouchableOpacityProps,
} from "react-native";
import { IModal } from ".";
import { IScrollView } from "../ScrollView";
import { IView } from "../View";

const { height } = Dimensions.get("window");

export const init = (props: IModal) => {
  const visibleState = useState(false);
  const [isOpen, setopen] = visibleState;
  const animateRef = useRef(new Animated.Value(0));
  const animate = animateRef.current;

  const runAnimation = () => {
    if (props.visible && !isOpen) {
      setopen(true);
      Animated.spring(animate, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else if (!props.visible && isOpen) {
      Animated.spring(animate, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setopen(false);
      });
    }
  };
  const onBackPress = () => {
    if (isOpen) {
      Animated.spring(animate, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setopen(false);
        props.onClose();
      });
      return true;
    } else {
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [isOpen])
  );

  useFocusEffect(
    useCallback(() => {
      runAnimation();
    }, [props.visible])
  );

  return {
    visibleState,
    animate,
  };
};

export const getBackdropProps = (props: IModal, animate: any) => {
  const cprops = { ...props.backdropProps };

  const style = generateBackdropStyle(props, animate);

  return {
    ...cprops,
    type: "animated",
    style,
  } as IView;
};

export const getButtonBackdropProps = (props: IModal, animate: any) => {
  const onDismiss = () => {
    Animated.spring(animate, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      props.onClose();
    });
  };

  const cprops: TouchableOpacityProps = {
    ...trimObject(get(props, "backdropProps", {}), ["style", "className"]),
    onPress: onDismiss,
    activeOpacity: 1,
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  };

  return cprops;
};

export const getPanelProps = (props: IModal, animateRef: any) => {
  const cprops = { ...props.panelProps };

  const style = generatePanelStyle(props, animateRef);

  return {
    ...cprops,
    type: "animated",
    ref: props.componentRef,
    style,
  } as IView;
};

export const getWrapperProps = (
  props: IModal,
  visibleState: any,
  animate: any
) => {
  const cprops = { ...props.wrapperProps };
  const [visible] = visibleState;
  const keyboardAvoidingViewProps = get(
    props,
    "wrapperProps.keyboardAvoidingViewProps",
    {}
  );
  keyboardAvoidingViewProps.className = `flex-none justify-center ${get(
    keyboardAvoidingViewProps,
    "className",
    ""
  )}`;
  cprops.rootStyle = generateRootWrapperStyle(props, animate);
  cprops.style = generateWrapperStyle(props, animate);
  cprops.keyboardAvoidingViewProps = keyboardAvoidingViewProps;

  return {
    ...cprops,
    stickyHeaderIndices: !!props.renderHeader ? [0] : undefined,
    ref: props.wrapperProps?.componentRef,
  } as IScrollView;
};

const generateBackdropStyle = (props: IModal, animate: any) => {
  const style = {};
  let className = `bg-black absolute top-0 left-0 right-0 bottom-0 bg-opacity-50 ${get(
    props,
    "backdropProps.className",
    ""
  )}`;

  Object.assign(
    style,
    tailwind(className),
    parseStyleToObject(props.backdropProps?.style),
    {
      opacity: animate.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }
  );

  return style;
};

const generateWrapperStyle = (props: IModal, animate: any) => {
  const style: any = {};
  const className = `${props.position === "full" ? "flex-grow" : ""} ${get(
    props,
    "className",
    ""
  )} ${get(props, "wrapperProps.className", "")}`;

  Object.assign(
    style,
    tailwind(className),
    parseStyleToObject(props.wrapperProps?.style),
    parseStyleToObject(props.wrapperProps?.contentContainerStyle)
  );

  return style;
};

const generateRootWrapperStyle = (props: IModal, animate: any) => {
  const style = {
    maxHeight: (80 / 100) * height,
  };
  let className = `flex-initial bg-white shadow-md`;
  Object.assign(style, tailwind());

  if (props.position === "top") {
    className = `${className} rounded-b-md`;
  } else if (props.position === "center") {
    className = `${className} rounded-md`;
  } else if (props.position === "full") {
    className = `${className} max-h-full h-full`;
  } else {
    className = `${className} rounded-t-md`;
  }

  Object.assign(
    style,
    tailwind(className),
    tailwind(props.wrapperProps?.rootClassName),
    parseStyleToObject(props?.wrapperProps?.rootStyle)
  );

  Object.assign(style, {
    elevation: props.visible ? get(style, "elevation", 0) : 0,
    shadowOpacity: props.visible ? get(style, "elevation", 0) : 0,
  });

  return style;
};

const generatePanelStyle = (props: IModal, animate: any) => {
  const style = {};
  let className =
    "flex flex-1 absolute top-0 left-0 right-0 bottom-0 bg-opacity-0";
  if (props.position === "top") {
    className = `${className} justify-start`;
  } else if (props.position === "center") {
    className = `${className} justify-center items-center self-center`;
  } else if (props.position === "full") {
    className = `${className} justify-start`;
  } else {
    className = `${className} justify-end`;
  }
  className = `${className} ${get(props, "panelProps.className", "")}`;
  Object.assign(style, tailwind(className));

  if (props.position === "top") {
    Object.assign(style, {
      opacity: animate.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: animate.interpolate({
            inputRange: [0, 0.85, 1],
            outputRange: [-height, 20, 0],
          }),
        },
      ],
    });
  } else if (props.position === "bottom") {
    Object.assign(style, {
      opacity: animate.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: animate.interpolate({
            inputRange: [0, 0.85, 1],
            outputRange: [height, -20, 0],
          }),
        },
      ],
    });
  } else {
    Object.assign(style, {
      opacity: animate.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: animate.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        },
      ],
    });
  }

  return style;
};
