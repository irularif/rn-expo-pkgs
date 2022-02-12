// @ts-ignore
import * as fontFamily from "assets/fonts/**/*.ttf";
// @ts-ignore
import * as libsFontFamily from "libs/assets/fonts/**/*.ttf";

interface IFontSource {
  [k: string]: number;
}
type fontName = keyof IFontSource;

type key = keyof IFontSource;
interface IFontStyle {
  [k: key]: {
    fontFamily: fontName;
  };
}

interface IFontNames {
  [k: fontName]: string;
}

const source: IFontSource = {};
const prefixes: string[] = [];
const FontStyle: IFontStyle = {};
const FontNames: IFontNames = {};

const generateFonts = () => {
  Object.keys(libsFontFamily).forEach((name: string) => {
    let arrName = name.split("$");
    if (prefixes.indexOf(arrName[0]) === -1) {
      prefixes.push(arrName[0]);
    }
    let fontName: string = arrName[arrName.length - 1];
    if (fontName.indexOf(arrName[0]) === -1) {
      fontName = `${arrName[0]}${fontName}`;
    }
    source[fontName] = libsFontFamily[name];
  });
  Object.keys(fontFamily).forEach((name: string) => {
    let arrName = name.split("$");
    if (prefixes.indexOf(arrName[0]) === -1) {
      prefixes.push(arrName[0]);
    }
    let fontName: string = arrName[arrName.length - 1];
    if (fontName.indexOf(arrName[0]) === -1) {
      fontName = `${arrName[0]}${fontName}`;
    }
    source[fontName] = fontFamily[name];
  });
  generateFontStyle(source);
  return source;
};

const generateFontStyle = (source: IFontSource) => {
  Object.keys(source).forEach((name: string) => {
    let prefix = prefixes.find((x: string) => name.indexOf(x) === 0);
    let fname: string = `font-${name}`;
    if (!!prefix) {
      fname = `font-` + name.replace(prefix, `${prefix}-`).toLowerCase();
    }
    FontStyle[fname] = {
      fontFamily: name,
    };
    FontNames[name] = fname;
  });
};

export const FontSources: any = generateFonts();
export { FontStyle, FontNames };
