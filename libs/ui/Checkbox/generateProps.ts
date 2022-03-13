import { trimObject } from "../../utils/misc";
import tailwind, {
  parseStyleToObject,
  trimClassName,
} from "../../utils/styles";
import { get } from "lodash";
import { ICheckbox } from ".";
import { IButton } from "../Button";
import { IIcon } from "../Icon";

const getCheckboxProps = (props: ICheckbox) => {
  const cprops: IButton = trimObject(props, ["value", "onChange"]);
  const onPress = () => {
    if (!!props.onChange) {
      props.onChange(!props.value);
    }
  };
  cprops.variant = "link";
  let className = `text-gray-600 ${get(props, "className", "")}`;
  let style: any = generateStyle(props);
  let borderColor;
  if (style.borderColor || style.color) {
    borderColor = { borderColor: style.borderColor || style.color };
  }
  const iconName = "checkmark-sharp";
  let iconClassName = `border rounded mr-2 ${
    !!props.value ? "bg-blue-500" : "bg-white"
  }`;
  let iconCheck: IIcon = {
    name: "checkmark-sharp",
    size: 20,
    style: borderColor,
  };
  if (!props?.position || props?.position === "left") {
    iconClassName = `${iconClassName} ${get(props, "prefix.className", "")}`;
    Object.assign(iconCheck, get(props, "prefix", {}), {
      name: iconName,
    });
  } else {
    iconClassName = `${iconClassName} ${get(props, "suffix.className", "")}`;
    Object.assign(iconCheck, get(props, "suffix", {}), {
      name: iconName,
    });
  }
  if (!props.value) {
    Object.assign(iconCheck, {
      color: "#ffffff00",
    });
  } else {
    Object.assign(iconCheck, {
      color: "#ffffff",
    });
    iconClassName = `${iconClassName}  ${get(props, "activeClassName", "")}`;
  }
  Object.assign(iconCheck, {
    className: iconClassName,
  });
  if (!props.position || props.position === "left") {
    cprops.prefix = iconCheck;
  } else {
    cprops.suffix = iconCheck;
  }
  cprops.isActive = !!props.value;

  return {
    ...cprops,
    onPress,
    className,
  };
};

const generateStyle = (props: ICheckbox) => {
  const style = {};
  const arrClass = get(props, "className", "").split(" ");
  let className = arrClass
    .filter((x) => ["border", "text"].indexOf(x))
    .join(" ");
  className = `bg-white ${className}`;
  className = trimClassName(className, [
    "error",
    "focus",
    "active",
    "disabled",
  ]);
  Object.assign(style, tailwind(className), parseStyleToObject(props.style));

  return style;
};

export default getCheckboxProps;
