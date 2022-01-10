import { Themes } from "../../../system/config";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { IText } from ".";

const getTextProps = (props: IText) => {
  const style = generateStyle(props);

  return {
    ...props,
    style,
    ref: props.componentRef,
  };
};

const generateStyle = (props: IText) => {
  let style: any = {};
  let className = "";

  if (!!Themes.textStyle && typeof Themes.textStyle === "string") {
    className = `${Themes.textStyle} ${className}`;
  } else {
    style = parseStyleToObject(Themes.textStyle);
  }
  className = `${className} ${get(props, "className", "")}`;

  if (!!className) {
    const arrClass = className.split(" ");
    className = arrClass.filter((x) => x.indexOf("active") === -1).join(" ");
  }

  Object.assign(style, tailwind(className), parseStyleToObject(props.style));

  return style;
};

export default getTextProps;
