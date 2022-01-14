import { get } from "lodash";
import { NativeModules } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ITopBar } from ".";
import { trimObject } from "../../utils/misc";
import { back } from "../../utils/navigation";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { IButton } from "../Button";
import { IView } from "../View";

const getTopBarProps = (props: ITopBar) => {
  const inset = useSafeAreaInsets();
  const cprops: IView = trimObject(props, [
    "leftAction",
    "rightAction",
    "title",
    "backButton",
    "onBack",
    "isLoading",
    "className",
  ]);
  const style = generateStyle(props, inset);

  return {
    ...cprops,
    style,
    ref: props.componentRef,
  };
};

const getBackButtonProps = (props: ITopBar) => {
  const onPress = (ev: any) => {
    back();
  };
  const cprops: IButton = {
    prefix: {
      name: "arrow-back",
      size: 26,
    },
    onPress,
  };
  Object.assign(
    cprops,
    {
      variant: "link",
    },
    props.backButtonProps,
    {
      className: `m-0 rounded-none flex h-full text-gray-900 bg-gray-500 ${get(
        props,
        "backButtonProps.className",
        ""
      )}`,
    }
  );

  return {
    ...cprops,
  };
};

const getTitleProps = (props: ITopBar) => {
  const cprops = { ...props.titleProps };
  const className = `${
    props.backButton ? "px-0" : "px-4"
  } py-2 font-bold text-lg flex flex-grow`;

  cprops.className = `${className} ${get(props, "titleProps.className", "")}`;

  return {
    ...cprops,
    children: props.title,
  };
};

const getSpinnerProps = (props: ITopBar) => {
  const cprops = { ...props.spinnerProps };
  const textStyle = generateSpinnerStyle(props);
  const color = cprops.color || textStyle.color;
  cprops.className = `px-4 ${get(props, "spinnerProps.className", "")}`;

  return {
    ...cprops,
    color,
  };
};

const generateStyle = (props: ITopBar, inset: any) => {
  const style: any = {
    minHeight: 56,
  };
  let className = `shadow z-10 flex flex-row items-center bg-white dark:bg-gray-900 ${get(
    props,
    "className",
    ""
  )}`;
  Object.assign(style, tailwind(className), parseStyleToObject(props.style));

  const paddingTop =
    get(style, "paddingTop", get(style, "padding", 0)) + inset.top;

  Object.assign(style, {
    paddingTop,
  });
  return style;
};

const generateSpinnerStyle = (props: ITopBar) => {
  const style: any = {};
  Object.assign(
    style,
    tailwind(get(props, "titleProps.className", "")),
    parseStyleToObject(props.titleProps?.style)
  );

  return style;
};

export { getBackButtonProps, getTitleProps, getSpinnerProps };

export default getTopBarProps;
