import { Themes } from "../../../system/config";
import { trimObject } from "../../utils/misc";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get, set } from "lodash";
import { useState } from "react";
import { TextInputProps } from "react-native";
import { ITextInput } from ".";
import { IButton } from "../Button";
import { IView } from "../View";

const getTextInputProps = (props: ITextInput, secure: boolean) => {
  const cprops: ITextInput = trimObject(props, [
    "secureButtonProps",
    "wrapperProps",
    "clearButton",
    "clearButtonProps",
  ]);

  const value = props.value || "";
  const type = props.type;
  // const pattern = props.mask;
  const [selection, setselection] = useState({
    start: 0,
    end: 0,
  });
  const style = generateStyle(props);

  const onKeyPress = (e: any) => {
    const key = e.nativeEvent.key;
    let pos = selection.start;
    if (key === "Backspace") {
      pos -= 1;
    } else {
      pos += 1;
    }

    if (!!value && pos + 1 > String(value)?.length) {
      pos = String(value)?.length;
    } else {
      pos = pos;
    }

    setselection({
      start: pos,
      end: pos,
    });
    if (!!props.onKeyPress) {
      props.onKeyPress(e);
    }
  };

  const parseValue = (text: string) => {
    let v: any;
    switch (props.type) {
      case "number":
        let b = text.replace(/[^0-9]/g, "");
        v = b || "";
        break;
      case "decimal":
        let c = text.replace(/[^0-9]/g, "");
        v = parseInt(c || "0");
        break;
      case "currency":
        let a = text.replace(/[^0-9]/g, "");
        v = parseInt(a || "0");
        break;
      case "email":
        v = text.replace(/\s/g, "").toLowerCase();
        break;
      case "float":
        v = text.replace(/[^0-9.,]/g, "");
        break;
      default:
        // if (!!pattern) {
        //   console.log("asd", text, StringMask(pattern, text));
        // }
        v = text;
        break;
    }
    return v;
  };

  const onChange = (e: any) => {
    let v = parseValue(get(e, "nativeEvent.text", ""));
    set(e, "nativeEvent.text", v);
    if (!!props.onChange) {
      props.onChange(e);
    }
  };

  const onChangeText = (text: string) => {
    let v = parseValue(text);

    if (!!props.onChangeText) {
      props.onChangeText(v);
    }
  };

  cprops.secureTextEntry = secure;
  cprops.onChangeText = onChangeText;
  cprops.onChange = onChange;

  let overideProps = { ...cprops };
  switch (type) {
    case "float":
    case "decimal":
    case "number":
      overideProps.keyboardType = "number-pad";
      overideProps.value = value.toString();
      break;
    case "multiline":
      overideProps.textAlignVertical = "top";
      overideProps.numberOfLines = overideProps.numberOfLines || 4;
      overideProps.multiline = true;
      break;
    case "currency":
      overideProps.value = value
        .toString()
        .replace(/,/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      overideProps.keyboardType = "number-pad";
      break;
    case "email":
      overideProps.keyboardType = "email-address";
      overideProps.value = value.toString();
    case "url":
      overideProps.keyboardType = "url";
      overideProps.value = value.toString();
      break;
    case "password":
      overideProps.value = value.toString();
      break;
    default:
      overideProps.value = value.toString();
      // if (!!pattern) {
      //   let v = !!pattern
      //     ? !!value
      //       ? StringMask(value, pattern).result
      //       : pattern
      //     : value;
      //   overideProps.value = v;
      // overideProps.maxLength = pattern?.length;
      // overideProps.selection = selection;
      // }
      // overideProps.onKeyPress = onKeyPress;
      break;
  }

  Object.assign(cprops, overideProps);

  return {
    ...cprops,
    textAlignVertical: "top",
    style,
    ref: props.componentRef,
  } as TextInputProps;
};

const getSecureProps = (props: ITextInput, secure: boolean, setsecure: any) => {
  const onPress = (e: any) => {
    setsecure(!secure);
    if (!!props.secureButtonProps?.onPress) {
      props.secureButtonProps.onPress(e);
    }
  };
  const cprops: IButton = { ...props.secureButtonProps };
  Object.assign(cprops, {
    prefix: {
      name: secure
        ? get(props, "iconSecureOff", "eye-off-outline")
        : get(props, "iconSecure", "eye-outline"),
    },
    variant: "link",
    size: "custom",
    onPress,
    isActive: secure,
    className: `text-gray-500 active:text-gray-700 rounded-none m-0 px-3 ${get(
      props,
      "secureButtonProps.className",
      ""
    )}`,
  });
  return cprops;
};

const getWrapperProps = (props: ITextInput) => {
  const cprops: IView = { ...props.wrapperProps };
  const style = generateWrapperStyle(props);

  return {
    ...cprops,
    style,
    ref: cprops.componentRef,
  };
};

const getClearButtonProps = (props: ITextInput, textInput: ITextInput) => {
  const cprops: IButton = { ...props.clearButtonProps };
  cprops.disabled = !props.value;
  const onPress = (e: any) => {
    if (textInput.onChangeText) {
      textInput.onChangeText("");
    }
    if (!!props.clearButtonProps?.onPress) {
      props.clearButtonProps.onPress(e);
    }
  };
  Object.assign(cprops, {
    prefix: {
      name: "close",
    },
    variant: "link",
    size: "custom",
    onPress,
    isActive: get(textInput, "value.length", 0) > 0,
    className: `text-gray-400 active:text-gray-600 rounded-none m-0 px-2 ${get(
      props,
      "clearButtonProps.className",
      ""
    )}`,
    ref: cprops.componentRef,
  });
  return cprops;
};

const getPrefixButtonProps = (props: ITextInput) => {
  const cprops: any = {
    variant: "link",
    size: "custom",
    className: `text-gray-400 rounded-none m-0 px-2 ${get(
      props,
      "prefix.className",
      ""
    )}`,
  };
  Object.assign(cprops, props.prefix);
  return cprops;
};

const getSufixButtonProps = (props: ITextInput) => {
  const cprops: any = {
    variant: "link",
    size: "custom",
    className: `text-gray-400 rounded-none m-0 px-2 ${get(
      props,
      "prefix.className",
      ""
    )}`,
  };
  Object.assign(cprops, props.suffix);
  return cprops;
};

const generateStyle = (props: ITextInput) => {
  let style: any = {
    minHeight: 36,
  };
  let className = `flex flex-1 px-1 ios:mx-1 android:mt-1 ios:pt-1`;
  if (typeof Themes.inputStyle === "string") {
    className = `${className} ${Themes.inputStyle}`;
  } else {
    style = parseStyleToObject(Themes.inputStyle);
  }
  if (!props.value) {
    if (typeof Themes.placeholderStyle === "string") {
      className = `${className} ${Themes.placeholderStyle}`;
    } else {
      Object.assign(style, parseStyleToObject(Themes.placeholderStyle));
    }
  }
  className = `${className} ${get(props, "className", "")}`;
  if (!!className) {
    const arrClass = className.split(" ");
    className = arrClass.filter((x) => x.indexOf("active") === -1).join(" ");
  }
  let cstyle = {};
  if (props.type === "multiline") {
    cstyle = {
      textAlignVertical: "top",
      minHeight: get(props, "numberOfLines", 4) * 20,
    };
  } else {
    cstyle = {
      textAlignVertical: "center",
    };
  }
  Object.assign(
    style,
    tailwind(className),
    cstyle,
    parseStyleToObject(props.style)
  );

  return style;
};

const generateWrapperStyle = (props: ITextInput) => {
  let style: any = {};
  let className = "flex flex-row";

  if (typeof Themes.inputWrapperStyle === "object") {
    style = parseStyleToObject(Themes.inputWrapperStyle);
  }
  if (typeof Themes.inputWrapperStyle === "string") {
    className = `${className} ${Themes.inputWrapperStyle}`;
  }
  if (props.editable === false) {
    className = `${className} bg-gray-100`;
  }
  className = `${className} ${get(props, "wrapperProps.className", "")}`;

  let cclassName = className
    .split(" ")
    .filter((x) => !x.includes("error"))
    .join(" ");
  let eclassName = "";
  if (!!props.isError) {
    eclassName = className
      .split(" ")
      .filter((x) => x.includes("error"))
      .map((x) => x.replace("error:", ""))
      .join(" ");
  }
  cclassName = `${cclassName} ${eclassName}`;

  Object.assign(
    style,
    tailwind(cclassName),
    parseStyleToObject(props.wrapperProps?.style)
  );

  return style;
};

export {
  getSecureProps,
  getWrapperProps,
  getClearButtonProps,
  getPrefixButtonProps,
  getSufixButtonProps,
};

export default getTextInputProps;
