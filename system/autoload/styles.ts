// @ts-ignore
import * as customStyle from "assets/styles/{*.json,**/*.json}";
// @ts-ignore
import * as libsStyle from "../../assets/styles/{*.json,**/*.json}";
import { FontStyle } from "./fonts";

const mergeStyle = () => {
  const allStyle = {};
  Object.keys(libsStyle).forEach((key) => {
    Object.assign(allStyle, libsStyle[key]);
  });
  Object.assign(allStyle, FontStyle);
  Object.keys(customStyle).forEach((key) => {
    Object.assign(allStyle, customStyle[key]);
  });

  return allStyle;
};

const Styles = mergeStyle();
export default Styles;
