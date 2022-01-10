import userTheme from "app/config/theme";
import { ITheme } from "../../types/global";
import theme from "./theme";

const themeObj: ITheme = theme;
export const Themes = Object.assign(themeObj, userTheme);
