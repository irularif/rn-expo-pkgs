const pSBC = (p: number, c0: string, c1: string = "", l: boolean = false) => {
  let r,
    g,
    b,
    P,
    f,
    t,
    h,
    i = parseInt,
    m = Math.round,
    a: any = typeof c1 == "string";
  let pSBCr;
  if (
    typeof p != "number" ||
    p < -1 ||
    p > 1 ||
    typeof c0 != "string" ||
    (c0[0] != "r" && c0[0] != "#") ||
    (c1 && !a)
  )
    return null;
  if (!pSBCr)
    pSBCr = (d: any) => {
      let n = d.length,
        x: any = {};
      if (n > 9) {
        ([r, g, b, a] = d = d.split(",")), (n = d.length);
        if (n < 3 || n > 4) return null;
        (x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))),
          (x.g = i(g)),
          (x.b = i(b)),
          (x.a = a ? parseFloat(a) : -1);
      } else {
        if (n == 8 || n == 6 || n < 4) return null;
        if (n < 6)
          d =
            "#" +
            d[1] +
            d[1] +
            d[2] +
            d[2] +
            d[3] +
            d[3] +
            (n > 4 ? d[4] + d[4] : "");
        d = i(d.slice(1), 16);
        if (n == 9 || n == 5)
          (x.r = (d >> 24) & 255),
            (x.g = (d >> 16) & 255),
            (x.b = (d >> 8) & 255),
            (x.a = m((d & 255) / 0.255) / 1000);
        else
          (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
      }
      return x;
    };
  (h = c0.length > 9),
    (h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
    (f = pSBCr(c0)),
    (P = p < 0),
    (t =
      c1 && c1 != "c"
        ? pSBCr(c1)
        : P
        ? { r: 0, g: 0, b: 0, a: -1 }
        : { r: 255, g: 255, b: 255, a: -1 }),
    (p = P ? p * -1 : p),
    (P = 1 - p);
  if (!f || !t) return null;
  if (l)
    (r = m(P * f.r + p * t.r)),
      (g = m(P * f.g + p * t.g)),
      (b = m(P * f.b + p * t.b));
  else
    (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
      (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
      (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
  (a = f.a),
    (t = t.a),
    (f = a >= 0 || t >= 0),
    (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
  if (h)
    return (
      "rgb" +
      (f ? "a(" : "(") +
      r +
      "," +
      g +
      "," +
      b +
      (f ? "," + m(a * 1000) / 1000 : "") +
      ")"
    );
  else
    return (
      "#" +
      (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
        .toString(16)
        .slice(1, f ? undefined : -2)
    );
};

const lightenByTenth = (colorRGBA: string) => {
  let color = colorRGBA;
  if (color.indexOf("#") === 0) {
    color = HexToRGB(color);
  }
  let rgbIntArray, alpha;
  if (color.indexOf("rgba") === 0) {
    rgbIntArray = color
      .replace(/ /g, "")
      .slice(5, -1)
      .split(",")
      .map((e) => parseInt(e));
    alpha = rgbIntArray[rgbIntArray.length - 1];
    rgbIntArray = rgbIntArray.slice(0, 3);
  } else {
    rgbIntArray = color
      .replace(/ /g, "")
      .slice(4, -1)
      .split(",")
      .map((e) => parseInt(e));
  }
  // Grab the values in order of magnitude
  // This uses the getLowestMiddleHighest function from the saturate section
  const [lowest, middle, highest] = getLowestMiddleHighest(rgbIntArray);

  if (lowest.val === 255) {
    return color;
  }

  const returnArray = [];

  // First work out increase on lower value
  returnArray[lowest.index] = Math.round(
    lowest.val + Math.min(255 - lowest.val, 25.5)
  );

  // Then apply to the middle and higher values
  const increaseFraction =
    (returnArray[lowest.index] - lowest.val) / (255 - lowest.val);
  returnArray[middle.index] =
    middle.val + (255 - middle.val) * increaseFraction;
  returnArray[highest.index] =
    highest.val + (255 - highest.val) * increaseFraction;

  // Convert the array back into an rgb string
  if (color.indexOf("rgba") === 0) {
    return `rgba(${returnArray.join()},${alpha})`;
  } else {
    return `rgb(${returnArray.join()})`;
  }
};

const darkenByTenth = (colorRGBA: string) => {
  // Our rgb to int array function again
  let color = colorRGBA;
  if (color.indexOf("#") === 0) {
    color = HexToRGB(color);
  }
  let rgbIntArray, alpha;
  if (color.indexOf("rgba") === 0) {
    rgbIntArray = color
      .replace(/ /g, "")
      .slice(5, -1)
      .split(",")
      .map((e) => parseInt(e));
    alpha = rgbIntArray[rgbIntArray.length - 1];
    rgbIntArray = rgbIntArray.slice(0, 3);
  } else {
    rgbIntArray = color
      .replace(/ /g, "")
      .slice(4, -1)
      .split(",")
      .map((e) => parseInt(e));
  }
  //grab the values in order of magnitude
  //this uses the function from the saturate function
  const [lowest, middle, highest] = getLowestMiddleHighest(rgbIntArray);

  if (highest.val === 0) {
    return color;
  }

  const returnArray = [];

  returnArray[highest.index] = (
    highest.val - Math.min(highest.val, 25.5)
  ).toFixed(2);
  const decreaseFraction =
    (highest.val - Number(returnArray[highest.index])) / highest.val;
  returnArray[middle.index] = (
    middle.val -
    middle.val * decreaseFraction
  ).toFixed(2);
  returnArray[lowest.index] = (
    lowest.val -
    lowest.val * decreaseFraction
  ).toFixed(2);

  // Convert the array back into an rgb string
  if (color.indexOf("rgba") === 0) {
    return `rgba(${returnArray.join()},${alpha})`;
  } else {
    return `rgb(${returnArray.join()})`;
  }
};

const getLowestMiddleHighest = (rgbIntArray: any[]) => {
  let highest = { val: -1, index: -1 };
  let lowest = { val: Infinity, index: -1 };

  rgbIntArray.map((val, index) => {
    if (val > highest.val) {
      highest = { val: val, index: index };
    }
    if (val < lowest.val) {
      lowest = { val: val, index: index };
    }
  });
  if (lowest.index === highest.index) {
    lowest.index = highest.index + 1;
  }
  let middle = { index: 3 - highest.index - lowest.index, val: Infinity };
  middle.val = rgbIntArray[middle.index];
  return [lowest, middle, highest];
};

const RGBToHex = (color: string) => {
  if (!color || color.indexOf("#") === 0) return color;
  let r = "0",
    g = "0",
    b = "0",
    a = "0";
  if (color.indexOf("rgba") === 0) {
    [r, g, b, a] = color
      .slice(5, color.length - 1)
      .replace(/\s/g, "")
      .split(",");
  } else {
    [r, g, b] = color
      .slice(4, color.length - 1)
      .replace(/\s/g, "")
      .split(",");
  }
  r = Number(r).toString(16);
  g = Number(g).toString(16);
  b = Number(b).toString(16);
  a = Math.round(Number(a) * 255).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  if (a.length == 1) a = "0" + a;

  if (color.indexOf("rgba") === 0) {
    return "#" + r + g + b + a;
  } else {
    return "#" + r + g + b;
  }
};

const HexToRGB = (h: string) => {
  let r = "0",
    g = "0",
    b = "0",
    a = "1";

  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length == 5) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
    a = "0x" + h[4] + h[4];
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  } else if (h.length == 9) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
    a = "0x" + h[7] + h[8];
  }

  if (h.length === 5 || h.length === 9) {
    a = String(+(Number(a) / 255).toFixed(3));
    return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
  } else {
    return "rgb(" + +r + "," + +g + "," + +b + ")";
  }
};

const darkenColor = (color: string, deep: number = 1) => {
  let c = color;
  if (c === "transparent") return c;
  for (let i = 0; i < deep; i++) {
    c = darkenByTenth(c);
  }
  return c;
};

const lightenColor = (color: string, deep: number = 1) => {
  let c = color;
  if (c === "transparent") return c;
  for (let i = 0; i < deep; i++) {
    c = lightenByTenth(c);
  }
  return c;
};

function lightOrDark(color: string) {
  let ncolor: any = color;
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (ncolor.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    ncolor = ncolor.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = ncolor[1];
    g = ncolor[2];
    b = ncolor[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    ncolor = +(
      "0x" + ncolor.slice(1).replace(ncolor.length < 5 && /./g, "$&$&")
    );

    r = ncolor >> 16;
    g = (ncolor >> 8) & 255;
    b = ncolor & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return "light";
  } else {
    return "dark";
  }
}

const addAlphaToHEX = (color: string, opacity: number) => {
  if (!color) return color;
  // coerce values so ti is between 0 and 100.
  const percent = Math.max(0, Math.min(100, opacity)); // bound percent from 0 to 100
  const intValue = Math.round((opacity / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  let _opacity = hexValue.padStart(2, "0").toUpperCase(); // format with leading 0 and upper case characters
  // let _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color.slice(0, 7) + _opacity;
};

export {
  RGBToHex,
  HexToRGB,
  lightenColor,
  darkenColor,
  pSBC,
  lightOrDark,
  addAlphaToHEX,
};
