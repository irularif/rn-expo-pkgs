import { Themes } from "../../../system/config";
import { useConfig } from "../../hooks";
import { trimObject } from "../../utils/misc";
import { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { StatusBarProps } from "react-native";
import { IPage } from ".";

export const getStatusBarProps = (props: IPage): StatusBarProps => {
  const { config } = useConfig();
  const cprops = { ...props.statusBarProps };

  const statusBarBgColor =
    cprops.backgroundColor || Themes.statusBarBgColor || "transparent";

  const statusBarStyle =
    cprops.barStyle ||
    (config.theme === "dark" ? "light-content" : "dark-content");

  return {
    translucent: true,
    ...cprops,
    backgroundColor: statusBarBgColor,
    barStyle: statusBarStyle,
  };
};

const getViewProps = (props: IPage) => {
  const cprops = trimObject(props, ["statusBarProps"]);
  let className = `flex h-full`;
  let style = {};

  if (typeof Themes.pageStyle === "string") {
    className = `${className} ${get(Themes, "pageStyle", "")}`;
  } else if (typeof Themes.pageStyle === "object") {
    style = parseStyleToObject(Themes.pageStyle);
  }

  className = `${className} ${get(props, "className", "")}`;
  Object.assign(style, parseStyleToObject(props.style));

  return { ...cprops, className, style };
};

export default getViewProps;
