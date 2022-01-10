import { trimObject } from "../../utils/misc";
import { parseStyleToObject } from "../../utils/styles";
import { get, set } from "lodash";
import tailwind from "tailwind-rn";
import { ICheckboxGroup } from ".";
import { IButton } from "../Button";
import { ICheckbox } from "../Checkbox";
import { IIcon } from "../Icon";

const isDeepValue = (items: any, path: string, value: boolean): boolean => {
  let status = true;
  for (let item of items) {
    if (Array.isArray(item.items)) {
      status = isDeepValue(item.items, path, value);
      if (!status) {
        break;
      }
    } else if (item[path] !== value) {
      status = false;
      break;
    }
  }

  return status;
};

const setDeepValue = (items: any, path: string, value: boolean): any[] => {
  items.forEach((item: any) => {
    if (Array.isArray(item.items)) {
      setDeepValue(item.items, path, value);
    } else {
      item[path] = value;
    }
  });

  return items;
};

const getCheckboxProps = (props: ICheckboxGroup, item: any, index: number) => {
  const cprops: ICheckbox = { ...props.checkboxProps };
  const items: any = JSON.parse(JSON.stringify(props.items));
  const valuePath = props.valuePath || "value";
  const labelPath = props.labelPath || "label";
  const onChange = (value: boolean) => {
    let path = props.deep ? `${props.deep}.` : "";
    set(items, `${path}${index}.${valuePath}`, value);

    if (props.onChange) {
      props.onChange(items);
    }
  };
  const value = get(item, `${valuePath}`, false);
  const label = get(item, `${labelPath}`, "");

  let className = `m-0 ${get(props, "checkboxProps.className", "")}`;
  let style = generateMarginStyle(props);

  return {
    ...cprops,
    onChange,
    value,
    label,
    className,
    style,
    ref: props.componentRef,
  };
};

const getCheckboxWithChildProps = (
  props: ICheckboxGroup,
  item: any,
  index: any
) => {
  const cprops = trimObject(props, []);
  const deep = get(props, "deep", "");
  let deepArr: any = [];
  if (!!deep) {
    deepArr = deep.split(".");
  }
  deepArr.push(`${index}.items`);
  const citemprops = trimObject(item, ["value", "items", "onChange"]);

  return { ...cprops, ...citemprops, deep: deepArr.join(".") };
};

const getTitleProps = (props: ICheckboxGroup) => {
  const cprops: IButton = trimObject(props, [
    "items",
    "valuePath",
    "labelPath",
    "checkboxProps",
    "titleProps",
    "wrapperProps",
  ]);
  const label = get(
    props,
    "titleProps.label",
    get(props, "label", "Select All")
  );
  let path = props.deep ? `items.${props.deep}` : "items";
  let items = get(props, path, []);
  items = JSON.parse(JSON.stringify(items));
  const valuePath = props.valuePath || "value";
  let allTrue = isDeepValue(items, valuePath, true);
  let allFalse = isDeepValue(items, valuePath, false);
  const onPress = (e: any) => {
    let pitems = JSON.parse(JSON.stringify(props.items));
    let nitems = [];
    if (!allTrue) {
      nitems = setDeepValue(items, valuePath, true);
    } else {
      nitems = setDeepValue(items, valuePath, false);
    }
    if (props.deep) {
      set(pitems, props.deep, nitems);
    } else {
      pitems = nitems;
    }

    if (props.onChange) {
      props.onChange([...pitems]);
    }
  };

  cprops.variant = "link";
  let className = `text-gray-600 font-bold m-0 ${get(props, "className", "")}`;
  let iconClassName = `border rounded mr-2 ${
    !allFalse ? "bg-blue-500" : "bg-white"
  }`;
  let styleIcon: any = generateIconStyle(props);
  let borderColor;
  if (styleIcon.borderColor || styleIcon.color) {
    borderColor = { borderColor: styleIcon.borderColor || styleIcon.color };
  }
  let iconName = allTrue ? "checkmark-sharp" : "remove";
  let iconCheck: IIcon = {
    size: 20,
    style: borderColor,
    name: "checkmark-sharp",
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
  if (!!allFalse) {
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
  if (!props?.position || props?.position === "left") {
    cprops.prefix = iconCheck;
  } else {
    cprops.suffix = iconCheck;
  }
  cprops.isActive = !!allTrue;
  const style = generateTitleMarginStyle(props);

  return {
    ...cprops,
    onPress,
    className,
    label,
    style,
    ref: props.componentRef,
  };
};

const getWrapperProps = (props: ICheckboxGroup) => {
  const cprops = get(props, "wrapperProps", {});

  return {
    ...cprops,
  };
};

const generateIconStyle = (props: ICheckboxGroup) => {
  const style = {};
  const arrClass = get(props, "className", "").split(" ");
  const className = arrClass
    .filter((x) => ["border", "text"].indexOf(x))
    .join(" ");
  Object.assign(style, tailwind(className), parseStyleToObject(props.style));
  return style;
};

const generateMarginStyle = (props: ICheckboxGroup) => {
  const style = {};

  const deep = get(props, "deep", "");
  let deepArr: string[] = [];
  if (!!deep) {
    deepArr = deep.split(".");
  }
  let ml = deepArr.filter((x) => x !== "items").length;
  Object.assign(style, parseStyleToObject(props.checkboxProps?.style), {
    marginLeft: ml * 10,
  });
  return style;
};

const generateTitleMarginStyle = (props: ICheckboxGroup) => {
  const style = {};

  const deep = get(props, "deep", "");
  let deepArr: string[] = [];
  if (!!deep) {
    deepArr = deep.split(".");
  }
  let ml = deepArr.filter((x) => x !== "items").length;
  Object.assign(style, parseStyleToObject(props.style));

  if (ml > 1) {
    Object.assign(style, {
      marginLeft: (ml - 1) * 10,
    });
  }

  return style;
};

export { getTitleProps, getWrapperProps, getCheckboxWithChildProps };
export default getCheckboxProps;
