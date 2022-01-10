import { trimObject } from "../../utils/misc";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { IIcon } from ".";
import { IView } from "../View";

const getIconProps = (props: IIcon) => {
  let { source, name, size, color } = props;
  size = size || 20;

  return {
    source,
    name,
    size,
    color,
  };
};

const getSVGProps = (props: IIcon) => {
  const cprops = { ...props };
  cprops.width = get(props, "width", get(props, "size", 20));
  cprops.height = get(props, "height", get(props, "size", 20));

  return cprops;
};

const getWrapperProps = (props: IIcon) => {
  const cprops: IView = trimObject(props, ["source", "name", "size", "color"]);

  const style = generateStyle(props);

  return {
    ...cprops,
    style,
    ref: props.componentRef,
  };
};

const generateStyle = (props: IIcon) => {
  const style = {};
  Object.assign(
    style,
    tailwind(get(props, "className", "")),
    parseStyleToObject(props.style)
  );

  return style;
};

export { getWrapperProps, getSVGProps };

export default getIconProps;
