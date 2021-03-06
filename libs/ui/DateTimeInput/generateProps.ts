import { Themes } from "../../../system/config";
import { dateFormat } from "../../utils/date";
import { trimObject } from "../../utils/misc";
import { parseStyleToObject, trimClassName } from "../../utils/styles";
import { capitalize, get } from "lodash";
import { IDateTimeInput } from ".";
import { IButton } from "../Button";
import { IDateTime } from "../DateTime";
import { IText } from "../Text";

const getLabel = (props: IDateTimeInput) => {
  const mode = get(props, "mode", "date");
  let label = capitalize(mode);
  if (props.formatLabel && !!props.value) {
    label = dateFormat(props.value, props.formatLabel);
  } else if (!!props.value) {
    switch (mode) {
      case "date":
        label = dateFormat(props.value, "MMMM dd, yyyy");
        break;
      case "datetime":
        label = dateFormat(props.value, "MMMM dd, yyyy - HH:mm:ss");
        break;
      case "time":
        label = dateFormat(props.value, "HH:mm");
        if (!label) {
          label = props.value;
        }
        break;
      default:
        label = dateFormat(props.value, "yyyy/MM/dd HH:mm:ss");
        break;
    }
  }
  return label;
};

const parseValue = (props: IDateTimeInput, value: Date) => {
  const mode = get(props, "mode", "date");
  let nvalue = "Date";
  if (props.formatValue && !!value) {
    nvalue = dateFormat(value, props.formatValue);
  } else if (!!value) {
    switch (mode) {
      case "date":
        nvalue = dateFormat(value, "yyyy-MM-dd");
        break;
      case "time":
        nvalue = dateFormat(value, "HH:mm");
        break;
      case "datetime":
      default:
        nvalue = dateFormat(value, "yyyy-MM-dd HH:mm:ss");
        break;
    }
  }
  return nvalue;
};

const getButtonProps = (props: IDateTimeInput, visibleDateState: any) => {
  const [_, setVisible] = visibleDateState;
  let value = new Date();
  if (!!props.value && typeof props.value === "string") {
    value = new Date(props.value);
  }
  const cprops: IButton = trimObject(props, ["value", "onChange", "date"]);
  const mode = get(props, "mode", "date");
  cprops.label = getLabel(props);

  if (mode === "time") {
    cprops.suffix = {
      name: "time-outline",
      ...cprops.suffix,
    };
  } else {
    cprops.suffix = {
      name: "calendar-outline",
      ...cprops.suffix,
    };
  }

  const onPress = (e: any) => {
    setVisible(true);
  };
  let className = `m-0 p-0 px-2`;
  if (typeof Themes.inputWrapperStyle === "string") {
    className = `${className} ${Themes.inputWrapperStyle || ""}`;
  }
  if (!props.value) {
    if (typeof Themes.placeholderStyle === "string") {
      className = `${className} ${Themes.placeholderStyle}`;
    }
  }
  let eclassName = "";
  if (!!props.isError) {
    eclassName = className
      .split(" ")
      .filter((x) => x.includes("error"))
      .map((x) => x.replace("error:", ""))
      .join(" ");
  }
  className = `${className} ${eclassName} ${get(props, "className", "")}`;
  className = trimClassName(className, ["error", "focus", "active"]);

  const labelProps: IText = get(props, "labelProps", {});
  const lstyle = {
    lineHeight: 40,
  };
  let lclassName = `flex-grow ${get(props, "labelProps.className", "")}`;
  if (typeof Themes.inputStyle === "string") {
    lclassName = `${lclassName} ${Themes.inputStyle}`;
  }

  if (!props.value) {
    if (typeof Themes.placeholderStyle === "string") {
      lclassName = `text-sm leading-10 ${lclassName} ${Themes.placeholderStyle}`;
    } else {
      Object.assign(lstyle, parseStyleToObject(Themes.placeholderStyle));
    }
  }
  if (!props.value) {
    lclassName = `${lclassName} text-gray-400`;
  }
  labelProps.className = lclassName;
  Object.assign(lstyle, parseStyleToObject(get(props, "labelProps.style", {})));
  labelProps.style = lstyle;

  return {
    ...cprops,
    labelProps,
    className,
    onPress,
  } as IButton;
};

const getDateTimeProps = (props: IDateTimeInput, visibleDateState: any) => {
  const [visible, setvisible] = visibleDateState;
  const cprops = { value: props.value, ...props.dateTimeProps };
  cprops.mode = props.mode;
  const onChange = (ev: any, value: Date) => {
    if (props.onChange) {
      props.onChange(parseValue(props, value));
    }
  };

  const onClose = () => {
    setvisible(false);
  };

  return {
    ...cprops,
    onChange,
    isOpen: visible,
    onClose,
  } as IDateTime;
};

export { getDateTimeProps };

export default getButtonProps;
