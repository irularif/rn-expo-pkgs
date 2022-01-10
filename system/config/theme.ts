import { ITheme } from "../../types/global";
import { RGBToHex } from "libs/utils/colors";
import { getColor } from "libs/utils/styles";

// tailwind css / style object but recomended use tailwind
const color = {
  primary: "blue-500",
  secondary: "yellow-500",
};

const fontStyle = "font-notosans-regular";

const theme: ITheme = {
  fontStyle,
  statusBarBgColor: "white dark:gray-800",
  pageStyle: "bg-gray-100 dark:bg-gray-800",
  textStyle: `${fontStyle} text-base text-gray-700 dark:text-white`,
  primaryColor: RGBToHex(getColor(color.primary)),
  secondaryColor: RGBToHex(getColor(color.secondary)),
  buttonStyle: `${fontStyle} bg-${color.primary}`,
  fieldStyle: "",
  inputStyle: "text-gray-600",
  inputWrapperStyle:
    "border border-gray-300 rounded-md bg-white error:bg-red-50 error:border error:border-red-300",
  placeholderStyle: "",
};

export default theme;
