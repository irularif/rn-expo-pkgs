import { cloneDeep } from "lodash";
import { IConfigSize, TSize } from "pkgs/types/global";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

const config = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
};

const initscreen = Dimensions.get("screen");
const initwindow = Dimensions.get("window");
const getOrientation = (screen: ScaledSize) => {
  return screen.height >= screen.width ? "portrait" : "landscape";
};

const useScreen = () => {
  const [size, setsize] = useState<TSize>("xs");
  const [screen, setscreen] = useState<ScaledSize>(initscreen);
  const [window, setwindow] = useState<ScaledSize>(initwindow);
  const [orientation, setorientation] = useState<"portrait" | "landscape">(
    getOrientation(initscreen)
  );

  const checkSize = () => {
    const { width } = screen;
    if (width >= config.xs && width < config.sm) {
      setsize("xs");
    } else if (width >= config.sm && width < config.md) {
      setsize("sm");
    } else if (width >= config.md && width < config.lg) {
      setsize("md");
    } else if (width >= config.lg) {
      setsize("lg");
    }
  };

  const handleWidth = ({ screen, window }: any) => {
    setscreen(cloneDeep(screen));
    setwindow(cloneDeep(window));
    setorientation(getOrientation(screen));
  };

  const select = useCallback(
    (params: IConfigSize) => {
      let selected: any;
      // @ts-ignore
      let keys: TSize[] = Object.keys(config);
      // @ts-ignore
      let pkeys: TSize[] = Object.keys(params);
      let idx = keys.indexOf(size);
      let pidx = pkeys.indexOf(size);
      if (pidx > -1) {
        return params[size];
      } else {
        for (let pk of pkeys) {
          let max = idx + 1 === keys.length;
          if (!max && config[pk] < config[keys[idx + 1]]) {
            selected = params[pk];
          }
        }
        return selected;
      }
    },
    [size]
  );

  useEffect(() => {
    checkSize();
  }, [screen]);

  useEffect(() => {
    checkSize();
    Dimensions.addEventListener("change", handleWidth);

    return () => {
      Dimensions.removeEventListener("change", handleWidth);
    };
  }, []);

  return {
    size,
    screen,
    window,
    orientation,
    select,
  };
};

export default useScreen;
