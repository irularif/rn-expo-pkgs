import { Themes } from "../../../system/config";
import { useConfig } from "../../hooks";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { ISpinner } from ".";

const getSpinnerProps = (props: ISpinner) => {
  const { config } = useConfig();
  const style = generateStyle(props);
  const cprops = {
    ...props,
  };
  delete cprops.wrapperProps;
  let { size, color } = props;
  color = color || (config.theme === "dark" ? "#fff" : Themes.primaryColor);

  return {
    ...cprops,
    style,
    size,
    color,
  };
};

const getWrapperProps = (props: ISpinner) => {
  const cprops: any = { ...props.wrapperProps };

  return {
    ...cprops,
    ref: props.componentRef,
  };
};

const generateStyle = (props: ISpinner) => {
  const style = {};
  Object.assign(
    style,
    tailwind(get(props, "className", "")),
    parseStyleToObject(props.style)
  );

  return style;
};

export { getWrapperProps };

export default getSpinnerProps;
