import { get } from "lodash";
import { Platform } from "react-native";
import { IKeyboardAvoidingView, IScrollView } from ".";
import tailwind, { parseStyleToObject } from "../../utils/styles";

const getScrollViewProps = (props: IScrollView): IScrollView => {
  const cprops = { ...props };
  delete cprops?.keyboardAvoidingViewProps;
  const style = generateScrollViewStyle(props);
  const contentContainerStyle = generateContentContainerStyle(props);
  cprops.keyboardShouldPersistTaps = "handled";

  return {
    ...cprops,
    style,
    contentContainerStyle,
    ref: cprops.componentRef,
  };
};

export const getKeyboardAvoidingViewProps = (
  props: IScrollView
): IKeyboardAvoidingView => {
  const cprops = { ...props.keyboardAvoidingViewProps };
  const style = generateKeyboardAvoidingViewStyle(props);

  return {
    behavior: Platform.OS == "ios" ? "padding" : "height",
    ...cprops,
    style,
    ref: cprops?.componentRef,
  };
};

const generateScrollViewStyle = (props: IScrollView) => {
  const style = {};
  const className = get(props, "rootClassName", "");
  Object.assign(
    style,
    tailwind(`${className}`),
    parseStyleToObject(props.rootStyle)
  );

  return style;
};

const generateContentContainerStyle = (props: IScrollView) => {
  const style = {};
  let className = `${get(props, "className", "")}`;

  Object.assign(
    style,
    tailwind(className),
    parseStyleToObject(props.style),
    parseStyleToObject(props.contentContainerStyle)
  );

  return style;
};

const generateKeyboardAvoidingViewStyle = (props: IScrollView) => {
  const style = {};
  let className = `flex-shrink flex-grow ${get(
    props,
    "keyboardAvoidingViewProps.className",
    ""
  )}`;

  Object.assign(
    style,
    tailwind(className),
    parseStyleToObject(props.keyboardAvoidingViewProps?.style)
  );

  return style;
};

export default getScrollViewProps;
