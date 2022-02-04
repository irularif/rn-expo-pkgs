import Styles from "../../system/autoload/styles";
import { Platform } from "react-native";
import { create } from "tailwind-rn";
import { FontNames } from "../../system/autoload/fonts";
import { useLibsSelector } from "../hooks/useLibsStore";

const { tailwind: RNTailwind, getColor: RNGetColor } = create(Styles);

const handleThemeClasses = (classes: string, isDarkMode: boolean) => {
  const regExp = isDarkMode ? /dark:/g : /dark:\S+/g;
  return classes.replace(regExp, "").replace(/\s\s/g, " ").trim();
};

const tailwind = (classes: string = "") => {
  const config = useLibsSelector((state) => state.config);
  let className = classes;
  let font = "";
  if (!!className) {
    const arrClass = className.split(" ");
    const fontClass = [...arrClass.filter((x) => x.indexOf("font-") > -1)];
    let newClass = [...arrClass.filter((x) => x.indexOf("font-") === -1)].map(
      (x) => {
        if (Platform.OS === "ios" && x.includes("android:")) {
          return "";
        } else if (Platform.OS === "android" && x.includes("ios:")) {
          return "";
        } else {
          return x.replace("ios:", "").replace("android:", "");
        }
      }
    );

    fontClass
      .filter((x) => x.indexOf("font-") > -1)
      .forEach((item: string) => {
        const isFont1 = Object.values(FontNames).indexOf(font) > -1;
        const isFont2 = Object.values(FontNames).indexOf(item) > -1;
        let f1 = font;
        let f2 = item;
        if (f2.indexOf("normal") > -1) {
          f2 = f2.replace("normal", "regular");
        }
        if (!isFont1 && !!isFont2) {
          f1 = f2;
        }
        let arrFont = f1.split("-");
        let arrF2 = f2.split("-");
        arrFont[arrFont.length - 1] = arrF2[arrF2.length - 1];
        font = arrFont.join("-");
      });
    let fsidx = newClass.indexOf("italic");
    if (fsidx > -1 && newClass[fsidx] === "italic") {
      if (font.indexOf("regular") > -1) {
        font = font.replace("regular", "italic");
      } else {
        font = `${font}italic`;
      }
      newClass.splice(fsidx, 1);
    }
    newClass.push(font);
    className = newClass.filter((x) => !!x).join(" ");
    return RNTailwind(handleThemeClasses(className, config.theme === "dark"));
  }
  return {};
};

const getColor = (color: string): any => {
  return RNGetColor(color);
};

const parseStyleToObject = (styles: any) => {
  let style = {};
  if (Array.isArray(styles)) {
    for (let s of styles) {
      if (!!s && typeof s === "object") {
        Object.assign(style, s);
      }
    }
  } else if (!!styles && typeof styles === "object") {
    style = styles;
  }

  return style;
};

const textStyle = [
  "textShadowOffset",
  "color",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "textAlign",
  "textDecorationLine",
  "textShadowColor",
  "fontFamily",
  "textShadowRadius",
  "textTransform",
  "includeFontPadding",
  "textAlignVertical",
  "fontVariant",
  "letterSpacing",
  "textDecorationColor",
  "textDecorationStyle",
  "writingDirection",
];

const getTextStyle = (style: any) => {
  const s: any = {};
  Object.keys(s).forEach((k) => {
    if (textStyle.indexOf(k) > -1) {
      s[k] = style[k];
    }
  });
  return s;
};

const trimTextStyle = (style: any) => {
  const s: any = style;
  Object.keys(s).forEach((k) => {
    if (textStyle.indexOf(k) > -1) {
      delete s[k];
    }
  });

  return s;
};

const trimStyle = (style: any, prefixs: string[]) => {
  const s = style;
  Object.keys(s).forEach((k) => {
    const isExist = prefixs.filter((x) => k.indexOf(x) === 0);
    if (isExist.length > 0) {
      delete s[k];
    }
  });

  return s;
};

const trimClassName = (className: string = "", prefixs: string[]) => {
  let nclassName = className
    .split(" ")
    .filter((x) => prefixs.filter((y) => !!x.includes(y)).length === 0)
    .join(" ");
  return nclassName;
};

export {
  getColor,
  RNGetColor,
  RNTailwind,
  handleThemeClasses,
  parseStyleToObject,
  getTextStyle,
  trimTextStyle,
  trimStyle,
  trimClassName,
};
export default tailwind;
