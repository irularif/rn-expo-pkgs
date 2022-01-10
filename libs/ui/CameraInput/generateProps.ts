import { Themes } from "../../../system/config";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import path from "path";
import { useEffect } from "react";
import { ICameraInput } from ".";
import { IButton } from "../Button";
import { ICamera } from "../Camera";
import { IText } from "../Text";

const getPickerProps = (
  props: ICameraInput,
  panelState: any,
  valueState: any
) => {
  const [_, setPanel] = panelState;
  const [value, setValue] = valueState;
  const cprops: IButton = {
    ...props,
  };
  const style = generateStyle(props);
  const onPress = (e: any) => {
    setPanel(true);
    if (props.onPress) {
      props.onPress(e);
    }
  };
  let className = `p-0 flex-col ${!value ? "py-4" : ""}`;
  if (typeof Themes.inputWrapperStyle === "string") {
    let cclassName = Themes.inputWrapperStyle
      .split(" ")
      .filter((x) => !x.includes("error"))
      .join(" ");
    className = `${className} ${cclassName}`;
  }
  className = `${className} ${get(props, "className", "")}`;

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return {
    ...cprops,
    onPress,
    className,
    style,
    ref: props.componentRef,
  };
};

const getImagePreviewProps = (props: ICameraInput, valueState: any) => {
  const [value, _] = valueState;
  const cprops = { ...props.imagePreviewProps };
  const className = `w-full bg-green-200 ${get(
    props,
    "imagePreviewProps.className",
    ""
  )}`;
  let source = {};
  if (value.indexOf("file://")) {
    source = {
      uri: value,
    };
  } else {
    if (props.prefixValue) {
      source = {
        uri: `${props.prefixValue}${value}`,
      };
    } else {
      source = {
        uri: value,
      };
    }
    Object.assign(source, {
      headers: get(props, "sourceHeader", {}),
    });
  }

  return {
    ...cprops,
    className,
    source,
    ref: cprops.componentRef,
  };
};

const getClearButtonProps = (props: ICameraInput, valueState: any) => {
  const [value, _] = valueState;
  const onPress = (e: any) => {
    if (props.onChange) {
      props.onChange("");
    }
    if (!!props.clearButtonProps?.onPress) {
      props.clearButtonProps.onPress(e);
    }
  };

  const cprops: any = {
    leftIcon: {
      name: "close",
      color: "red",
    },
    variant: "link",
    size: "custom",
    className:
      "bg-white rounded-none rounded-bl-md text-gray-400 active:text-gray-600 m-0 p-2 absolute top-0 right-0",
    labelProps: {
      numberOfLines: 1,
      ellipsizeMode: "tail",
    },
    ...props.clearButtonProps,
    isActive: !!value,
    onPress,
    ref: props.clearButtonProps?.componentRef,
  };
  return cprops;
};

const getIconProps = (props: ICameraInput) => {
  const cprops = {
    name: "camera",
    size: 50,
    ...props.iconPreviewProps,
  };
  const style = generateIconStyle(props);
  const color = get(props, "iconPreviewProps.color", style?.color);

  return {
    ...cprops,
    color,
  };
};

const getTextProps = (props: ICameraInput) => {
  const cprops = {
    children: "Press to pick a picture.",
    ...props.textPreviewProps,
  };
  let className = ``;
  if (typeof Themes.inputStyle === "string") {
    className = Themes.inputStyle;
  }
  className = `${className} ${get(props, "textPreviewProps.className", "")}`;
  if (!!className) {
    const arrClass = className.split(" ");
    className = arrClass.filter((x) => x.indexOf("active") === -1).join(" ");
  }
  return {
    ...cprops,
    className,
  };
};

const getPanelCameraProps = (
  props: ICameraInput,
  panelState: any,
  valueState: any
) => {
  const [panel, setPanel] = panelState;
  const [value, setVlue] = valueState;
  const onClose = () => {
    setPanel(false);
  };
  const onChange = (uri: string) => {
    setVlue(uri);
    props.onChange(uri);
  };

  const cprops: ICamera = {
    ...props.panelCameraProps,
    uri: value,
    visible: panel,
    onClose,
    onChange,
  };

  return {
    ...cprops,
    visible: panel,
  };
};

const getUriProps = (valueState: any) => {
  const [value, _] = valueState;
  const getName = () => {
    let name = "";
    if (!!value) {
      name = path.basename(value);
    }
    return name;
  };
  const cprops: IText = {
    children: getName(),
    ellipsizeMode: "tail",
    numberOfLines: 1,
    className: "py-1 px-2",
  };

  return cprops;
};

const generateStyle = (props: ICameraInput) => {
  let style: any = {};
  if (typeof Themes.inputWrapperStyle === "object") {
    style = parseStyleToObject(Themes.inputWrapperStyle);
  }

  Object.assign(style, parseStyleToObject(props.style));
  return style;
};

const generateIconStyle = (props: ICameraInput) => {
  let style: any = {};
  let className = ``;
  if (typeof Themes.inputStyle === "string") {
    className = Themes.inputStyle;
  } else {
    style = parseStyleToObject(Themes.inputStyle);
  }
  className = `${className} ${get(props, "iconPreviewProps.className", "")}`;

  if (!!className) {
    const arrClass = className.split(" ");
    className = arrClass.filter((x) => x.indexOf("active") === -1).join(" ");
  }
  Object.assign(
    style,
    tailwind(className),
    parseStyleToObject(props.iconPreviewProps?.style)
  );
  return style;
};

export {
  getClearButtonProps,
  getImagePreviewProps,
  getIconProps,
  getTextProps,
  getPanelCameraProps,
  getUriProps,
};

export default getPickerProps;
