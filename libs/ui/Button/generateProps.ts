import { Themes } from "../../../system/config";
import { FormContext } from "../../../system/context/form";
import { IFormStore } from "../../../types/global";
import { lightenColor, lightOrDark, pSBC } from "../../utils/colors";
import { trimObject } from "../../utils/misc";
import tailwind, {
  getColor,
  parseStyleToObject,
  trimStyle,
  trimTextStyle,
} from "../../utils/styles";
import { cloneDeep, get } from "lodash";
import { useContext } from "react";
import { IButton } from ".";
import { ISpinner } from "../Spinner";

const getButtonProps = (props: IButton, pressState: any) => {
  const form: IFormStore = useContext(FormContext) || ({} as any);
  const cprops: IButton = trimObject(props, [
    "label",
    "size",
    "variant",
    "direction",
    "type",
    "prefix",
    "suffix",
    "fill",
    "round",
    "isLoading",
    "isActive",
    "labelProps",
    "spinnerProps",
    "children",
  ]);

  const [isPress, setPress] = pressState;
  const style = generateButtonStyle(props, isPress);
  const onPressIn = (e: any) => {
    setPress(true);
    if (!!props.onPressIn) {
      props.onPressIn(e);
    }
  };
  const onPressOut = (e: any) => {
    setPress(false);
    if (!!props.onPressIn) {
      props.onPressIn(e);
    }
  };
  const onPress = (e: any) => {
    if (props.type === "submit" && form.onSubmitForm) {
      form.onSubmitForm();
    } else if (props.type === "reset" && form.onResetForm) {
      form.onResetForm();
    }
    if (props?.onPress) {
      props.onPress(e);
    }
  };
  const disabled = !!props.isLoading || !!props.disabled;

  return {
    activeOpacity: 1,
    ...cprops,
    disabled,
    onPress,
    onPressIn,
    onPressOut,
    style,
    ref: props.componentRef,
  };
};

const getTextProps = (props: IButton, pressState: any) => {
  const [isPress, _] = pressState;
  const cprops = { ...props.labelProps };
  const style = generateTextStyle(props, isPress);

  let children = props.children;
  if (typeof children !== "string") {
    children = props.label;
  }

  return {
    ...cprops,
    children,
    style,
    ref: cprops.componentRef,
  };
};

const getLeftIconProps = (props: IButton) => {
  const textStyle = generateTextStyle(props);
  const leftIcon: any = { ...props.prefix };
  leftIcon.color = leftIcon?.color || textStyle?.color;
  leftIcon.className = `${!!props.children || props.label ? "mr-1" : ""} ${
    leftIcon.className || ""
  }`;

  return leftIcon;
};

const getRightIconProps = (props: IButton) => {
  const textStyle = generateTextStyle(props);
  const rightIcon: any = { ...props.suffix };
  rightIcon.color = rightIcon?.color || textStyle?.color;
  rightIcon.className = `${!!props.children || props.label ? "ml-1" : ""} ${
    rightIcon.className || ""
  }`;

  return rightIcon;
};

const getSpinnerProps = (props: IButton): ISpinner => {
  const cprops = { ...props.spinnerProps };
  const textStyle = generateTextStyle(props);
  const color = textStyle.color;
  cprops.className = `${!!props.children || props.label ? "mr-1" : ""} ${
    cprops.className || ""
  }`;

  return {
    ...cprops,
    color,
  };
};

const generateOriginalStyle = (props: IButton) => {
  let style: any = {};
  let className = `rounded-md m-1 justify-center items-center ${
    props?.direction === "vertical" ? "flex-col" : "flex-row"
  }`;

  if (typeof Themes.buttonStyle === "string") {
    className = `${className} ${Themes.buttonStyle}`;
  } else {
    style = parseStyleToObject(Themes.buttonStyle);
  }

  switch (props.size) {
    case "small":
      className = `${className} px-2 py-1`;
      break;
    case "large":
      className = `${className} px-4 py-3`;
      break;
    default:
      className = `${className} px-3 py-2`;
      break;
  }

  if (props.round) {
    switch (props.size) {
      case "small":
        className = `${className} rounded-full px-3`;
        break;
      case "large":
        className = `${className} rounded-full px-5`;
        break;
      case "custom":
        className = `${className} rounded-full px-1`;
        break;
      default:
        className = `${className} rounded-full px-4`;
        break;
    }
  }

  className = `${className} ${props.className || ""}`;

  if (!!className) {
    const arrClass = className.split(" ");
    className = arrClass
      .filter((x) => x.indexOf("active") === -1 && x.indexOf("disabled") === -1)
      .join(" ");
  }

  Object.assign(style, tailwind(className), parseStyleToObject(props.style));
  return style;
};

const generateStyle = (props: IButton) => {
  let style: any = generateOriginalStyle(props);
  const variant = props.variant;

  let bgColor = Themes?.primaryColor || getColor("blue-500");
  if (!!style.backgroundColor) {
    bgColor = style.backgroundColor;
  }

  let variantStyle: any = {};
  switch (variant) {
    case "link":
      Object.assign(variantStyle, {
        backgroundColor: "#ffffff00",
        border: 0,
      });
      break;
    case "secondary":
      Object.assign(variantStyle, {
        borderBottomColor: pSBC(0.2, lightenColor(bgColor, 3), "", true),
        borderLeftColor: pSBC(0.2, lightenColor(bgColor, 3), "", true),
        borderRightColor: pSBC(0.2, lightenColor(bgColor, 3), "", true),
        borderTopColor: pSBC(0.2, lightenColor(bgColor, 3), "", true),
        backgroundColor: pSBC(0.6, lightenColor(bgColor, 5), "", true),
        borderWidth: 2,
      });
      break;
    default:
      Object.assign(variantStyle, {
        backgroundColor: bgColor,
      });
      break;
  }
  let bgIsDark = lightOrDark(variantStyle.backgroundColor) === "dark";
  if (!!style.color) {
    Object.assign(variantStyle, {
      color: style.color,
    });
  } else {
    if (bgIsDark) {
      Object.assign(variantStyle, {
        color: pSBC(1, bgColor, "", true),
      });
    } else {
      Object.assign(variantStyle, {
        color: pSBC(-0.4, bgColor),
      });
    }
  }

  Object.assign(style, variantStyle, parseStyleToObject(props.style));

  if (props.fill) {
    Object.assign(style, {
      flexGrow: 1,
    });
  }

  const disabledStyle = generateDisabledStyle(props);
  if (props.disabled || props.isLoading) {
    let backgroundColor =
      style?.backgroundColor !== "transparent"
        ? bgIsDark
          ? pSBC(0.3, style?.backgroundColor)
          : pSBC(-0.1, style?.backgroundColor, "", true)
        : style?.backgroundColor;
    let txtColor = pSBC(0.3, style?.color);

    Object.assign(style, {
      backgroundColor,
      color: txtColor,
    });

    let borderColor = pSBC(0.3, style?.color);

    Object.assign(
      style,
      {
        borderBottomColor: borderColor,
        borderLeftColor: borderColor,
        borderRightColor: borderColor,
        borderTopColor: borderColor,
      },
      disabledStyle
    );
  }

  return style;
};

const generateActiveStyle = (props: IButton) => {
  const style = {};
  let className = get(props, "className", "");

  if (!!className) {
    const arrClass = className.split(" ");
    className = arrClass.filter((x) => x.indexOf("active") > -1).join(" ");
    className = className.replace(/active:/g, "");
  }

  Object.assign(style, tailwind(className));
  return style;
};

const generateDisabledStyle = (props: IButton) => {
  const style = {};
  let className = get(props, "className", "");

  if (!!className) {
    const arrClass = className.split(" ");
    className = arrClass.filter((x) => x.indexOf("disabled") > -1).join(" ");
    className = className.replace(/disabled:/g, "");
  }

  Object.assign(style, tailwind(className));
  return style;
};

const generateButtonStyle = (props: IButton, isPress: boolean) => {
  let ostyle: any = generateOriginalStyle(props);
  const activeStyle = generateActiveStyle(props);

  let bgColor = Themes?.primaryColor || getColor("blue-500");
  if (!!ostyle.backgroundColor) {
    bgColor = ostyle.backgroundColor;
  }

  let style = generateStyle(props);
  style = trimTextStyle(style);

  const stylePress: any = cloneDeep(style);
  if (props.variant === "link") {
    Object.assign(stylePress, {
      backgroundColor: pSBC(0.6, lightenColor(bgColor, 4), "", true),
    });
  } else if (props.variant === "secondary") {
    Object.assign(stylePress, {
      backgroundColor: pSBC(0.7, lightenColor(bgColor, 1), "", true),
    });
  } else {
    Object.assign(stylePress, {
      backgroundColor: pSBC(-0.1, bgColor, "", true),
    });
  }
  if (props.isActive) {
    const styleActive: any = cloneDeep(style);
    Object.assign(styleActive, activeStyle);
    if (isPress) {
      const styleActPress: any = {};
      Object.assign(styleActPress, stylePress);
      return styleActPress;
    } else {
      return styleActive;
    }
  } else if (!props.disabled && isPress) {
    return stylePress;
  } else {
    return style;
  }
};

const generateTextStyle = (props: IButton, isPress?: boolean) => {
  let style = generateStyle(props);
  const activeStyle = generateActiveStyle(props);
  Object.assign(style, parseStyleToObject(props.labelProps?.style));

  const ex = [
    "margin",
    "padding",
    "background",
    "border",
    "width",
    "flex",
    "height",
    "shadow",
    "opacity",
  ];
  style = trimStyle(style, ex);
  Object.assign(style, {
    flexShrink: 1,
  });

  const stylePress: any = cloneDeep(style);
  Object.assign(stylePress, {
    color: pSBC(0.05, stylePress?.color, "", true),
  });

  if (props.isActive) {
    let styleActive: any = cloneDeep(style);
    Object.assign(styleActive, activeStyle);
    styleActive = trimStyle(styleActive, ex);
    return styleActive;
  } else if (!props.disabled && isPress) {
    return stylePress;
  } else {
    return style;
  }
};

export { getLeftIconProps, getRightIconProps, getTextProps, getSpinnerProps };

export default getButtonProps;
