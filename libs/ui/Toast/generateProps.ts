import { get } from "lodash";
import useKeyboard, { IKeyboard } from "pkgs/libs/hooks/useKeyboard";
import { useLibsDispatch, useLibsSelector } from "pkgs/libs/hooks/useLibsStore";
import { trimObject } from "pkgs/libs/utils/misc";
import tailwind from "pkgs/libs/utils/styles";
import { ToastStateAction } from "pkgs/system/store/toast";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Platform } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { IToast } from ".";
import { IView } from "../View";

const { height } = Dimensions.get("window");

export const init = () => {
  const animateRef = useRef(new Animated.Value(0));
  const animate = animateRef.current;
  const dispatch = useLibsDispatch();
  const toast = useLibsSelector((state) => state.toast);
  const [visible, setvisible] = useState(false);
  const currentAnim = useRef<any>();

  const run = () => {
    Animated.timing(animate, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        currentAnim.current = setTimeout(() => {
          Animated.timing(animate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) {
              setvisible(false);
              dispatch(ToastStateAction.init({}));
            }
          });
        }, toast.duration);
      }
    });
  };

  useEffect(() => {
    if (!!toast.init) {
      setvisible(toast.init);
      run();
    } else if (!toast.init && !!currentAnim.current) {
      clearTimeout(currentAnim.current);
      Animated.timing(animate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setvisible(false);
        }
      });
    }
  }, [toast]);

  return {
    animate,
    visible,
  };
};

export const generateWrapperProps = (animate: any) => {
  const keyboardState = useKeyboard();
  const inset = useSafeAreaInsets();
  const toast = useLibsSelector((state) => state.toast);
  const cprops = trimObject(get(toast, "props", {}), [
    "className",
    "messageProps",
  ]);
  const style = generateWrapperStyle(
    get(toast, "props", {}),
    animate,
    inset,
    keyboardState
  );

  return {
    ...cprops,
    style,
    type: "animated",
  } as IView;
};

export const generateTextProps = () => {
  const toast = useLibsSelector((state) => state.toast);
  const cprops = get(toast, "props.messageProps", {});
  let className = `text-white ${cprops.className || ""}`;

  return {
    ...cprops,
    children: toast.message,
    className,
  };
};

const generateWrapperStyle = (
  props: IToast,
  animate: any,
  inset: EdgeInsets,
  keyboardState: IKeyboard
) => {
  let style: any = {};
  let className =
    "absolute left-0 right-0 bg-opacity-0 rounded m-4 bg-gray-700 p-2 px-4 z-50";
  if (props.position === "top") {
    style = {
      top: inset.top,
    };
  } else {
    style = {
      bottom: inset.bottom,
    };
    if (keyboardState.isVisible && Platform.OS === "ios") {
      style.bottom += keyboardState.height;
    }
  }
  className = `${className} ${get(props, "className", "")}`;
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
            outputRange: [-height, -20, 0],
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
            inputRange: [0, 0.85, 1],
            outputRange: [height, 20, 0],
          }),
        },
      ],
    });
  }

  return style;
};
