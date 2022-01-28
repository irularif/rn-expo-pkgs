import { useFocusEffect } from "@react-navigation/core";
import { Themes } from "../../../system/config";
import { IItem } from "../../../types/global";
import fuzzyMatch from "../../utils/fuzzy-match";
import { trimObject } from "../../utils/misc";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { cloneDeep, debounce, get, set } from "lodash";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Keyboard,
  ListRenderItemInfo,
  Platform,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { ISelect } from ".";
import { IButton } from "../Button";
import { IList } from "../List";
import { IText } from "../Text";
import { ITextInput } from "../TextInput";
import { IView } from "../View";

const { width, height } = Dimensions.get("window");

export const getSelected = (props: ISelect, items: any) => {
  const value = get(props, "value", "");
  const valuePath = get(props, "valuePath", "");
  let isSelected = false;
  let selected;
  for (let item of items) {
    if (typeof item === "object") {
      if (!!valuePath) {
        isSelected = item[valuePath] == value;
      } else {
        let k = Object.keys(item);
        if (
          k.length > 0 &&
          (typeof item[k[0]] === "string" || typeof item[k[0]] === "number")
        ) {
          isSelected = item[k[0]] == value;
        }
      }
    } else if (typeof item === "string" || typeof item === "number") {
      isSelected = item == value;
    }
    if (isSelected) {
      selected = item;
      break;
    }
  }
  return selected;
};
export const getSelectedIndex = (props: ISelect, items: any) => {
  const value = get(props, "value", "");
  const valuePath = get(props, "valuePath", "");
  let isSelected = false;
  let selected;
  let index = 0;
  for (let item of items) {
    if (typeof item === "object") {
      if (!!valuePath) {
        isSelected = item[valuePath] == value;
      } else {
        let k = Object.keys(item);
        if (
          k.length > 0 &&
          (typeof item[k[0]] === "string" || typeof item[k[0]] === "number")
        ) {
          isSelected = item[k[0]] == value;
        }
      }
    } else if (typeof item === "string" || typeof item === "number") {
      isSelected = item == value;
    }
    if (isSelected) {
      selected = item;
      break;
    }
    index += 1;
  }
  return !!selected ? index : -1;
};
const getLabel = (
  props: ISelect,
  item: any,
  defaultValue: string = ""
): string => {
  const valuePath = get(props, "valuePath", "");
  const labelPath = get(props, "labelPath", "");
  let label = defaultValue;
  if (!item) return label;
  if (typeof item === "object") {
    if (!!labelPath && item[labelPath]) {
      label = item[labelPath];
    } else if (!!valuePath) {
      label = item[valuePath] || label;
    } else {
      label = getValue(props, item);
    }
  } else if (typeof item === "string" || typeof item === "number") {
    label = String(item);
  }
  return label;
};
const getValue = (props: ISelect, item: any) => {
  const valuePath = get(props, "valuePath", "");
  let value = "";
  if (typeof item === "object") {
    if (!!valuePath) {
      value = item[valuePath] || value;
    } else {
      let k = Object.keys(item);
      if (
        k.length > 0 &&
        (typeof item[k[0]] === "string" || typeof item[k[0]] === "number")
      ) {
        value = item[k[0]];
      }
    }
  } else if (typeof item === "string" || typeof item === "number") {
    value = String(item);
  }
  return value;
};
const donFilter = debounce((filterItem) => {
  filterItem();
}, 500);

export const init = (props: ISelect) => {
  const itemsState = useState([] as IItem[]);
  const filterState = useState("");
  const dropdownOpenState = useState(false);
  const btnPosState: any = useState(null);
  const wrpPosState: any = useState(null);
  const wrapperRef: any = useRef();
  const buttonRef: any = useRef();
  const animateRef = useRef(new Animated.Value(0));
  const [isOpen, setopen] = dropdownOpenState;
  const [_, setposstate] = btnPosState;
  const [____, setwrpstate] = wrpPosState;
  const [items, setitems] = itemsState;
  const [filter, __] = filterState;
  const animate = animateRef.current;
  const keyboardHeightState = useState(0);
  const [_____, setKeyboardHeight] = keyboardHeightState;

  const getButtonPos = async () => {
    if (!!buttonRef?.current) {
      buttonRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          setposstate({
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          });
        }
      );
    }
  };

  const filterItem = () => {
    if (!!props.filterProps?.onFilter) {
      props.filterProps?.onFilter(filter);
    } else {
      if (!!filter && Array.isArray(props.items)) {
        let item = props.items.filter((x) => {
          let value = getLabel(props, x);
          if (!value) {
            return false;
          }

          let match = fuzzyMatch(
            String(value).toLowerCase(),
            String(filter).toLowerCase()
          );
          return match;
        });
        setitems(item);
      } else if (!filter && Array.isArray(props.items)) {
        if (items.length !== props.items.length) {
          setitems(props.items);
        }
      }
    }
  };

  const onfilter = debounce(() => {
    donFilter(filterItem);
  }, 500);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isOpen) {
          setopen(false);
          return true;
        } else {
          return false;
        }
      };

      let backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backHandler.remove();
    }, [isOpen])
  );

  useFocusEffect(
    useCallback(() => {
      if (Array.isArray(props.items)) {
        setitems(props.items);
      }
    }, [props.items])
  );

  useFocusEffect(
    useCallback(() => {
      set(props, "componentRef.current", buttonRef.current);
    }, [buttonRef.current])
  );

  useFocusEffect(
    useCallback(() => {
      set(props, "wrapperProps.componentRef.current", wrapperRef.current);
    }, [wrapperRef.current])
  );

  useFocusEffect(
    useCallback(() => {
      if (isOpen) {
        getButtonPos();
      } else {
        setwrpstate(null);
        setposstate(null);
      }
    }, [isOpen])
  );

  useFocusEffect(
    useCallback(() => {
      onfilter();
    }, [filter])
  );

  function onKeyboardDidShow(e: any) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useFocusEffect(
    useCallback(() => {
      const keyshow = Keyboard.addListener(
        "keyboardDidShow",
        onKeyboardDidShow
      );
      const keyhide = Keyboard.addListener(
        "keyboardDidHide",
        onKeyboardDidHide
      );
      return () => {
        keyshow.remove();
        keyhide.remove();
      };
    }, [])
  );

  return {
    buttonRef,
    wrapperRef,
    itemsState,
    dropdownOpenState,
    btnPosState,
    wrpPosState,
    filterState,
    keyboardHeightState,
    animate,
  };
};

export const getButtonProps = (
  props: ISelect,
  itemsState: any,
  dropdownOpenState: any,
  buttonRef: any
) => {
  const [isOpen, setopen] = dropdownOpenState;
  const [items, _] = itemsState;
  const selectedItem = getSelected(props, items);
  const cprops: IButton = trimObject(props, []);
  let label = get(props, "placeholder", "Select");
  if (props.value) {
    label = getLabel(
      props,
      selectedItem,
      get(props, "label", props.value || label)
    );
  }
  cprops.label = label;
  cprops.suffix = {
    name: "chevron-down",
    ...props.suffix,
  };
  cprops.size = "custom";
  cprops.disabled = !get(props, "editable", true);

  const onPress = (e: any) => {
    setopen(!isOpen);
  };

  let className = `m-0 p-0 px-2`;
  if (typeof Themes.inputWrapperStyle === "string") {
    let cclassName = Themes.inputWrapperStyle
      .split(" ")
      .filter((x) => !x.includes("error"))
      .join(" ");
    className = `${className} ${cclassName}`;
  }
  if (!props.value) {
    if (typeof Themes.placeholderStyle === "string") {
      className = `${className} ${Themes.placeholderStyle}`;
    }
  }
  className = `${className} ${get(props, "className", "")}`;

  const labelProps: IText = get(props, "labelProps", {});
  let lstyle: TextStyle = {
    lineHeight: 40,
  };
  let lclassName = `flex-grow ${get(props, "labelProps.className", "")}`;
  if (typeof Themes.inputStyle === "string") {
    lclassName = `${lclassName} ${Themes.inputStyle}`;
  }
  if (!props.value) {
    if (typeof Themes.placeholderStyle === "string") {
      lclassName = `text-sm ${lclassName} ${Themes.placeholderStyle}`;
    } else {
      Object.assign(lstyle, parseStyleToObject(Themes.placeholderStyle));
    }
  }
  if (!props.value) {
    lclassName = `${lclassName} text-gray-400`;
  }
  lclassName = `${lclassName}`;
  labelProps.className = lclassName;
  Object.assign(lstyle, parseStyleToObject(get(props, "labelProps.style", {})));

  return {
    ...cprops,
    labelProps: {
      ...labelProps,
      className: lclassName,
      style: lstyle,
    },
    className,
    componentRef: buttonRef,
    onPress,
  } as IButton;
};

export const getDropdownWrapperProps = (
  props: ISelect,
  wrapperRef: any,
  btnPosState: any,
  wrpPosState: any,
  keyboardHeightState: any,
  animate: any
) => {
  const [keyboardHeight] = keyboardHeightState;
  const [wrppos, setwrpstate] = wrpPosState;
  const [btnpos, __] = btnPosState;
  const style = generateWrapperStyle(
    props,
    animate,
    btnpos,
    wrppos,
    keyboardHeight
  );
  let className = `shadow rounded bg-white ${get(
    props,
    "wrapperProps.className",
    ""
  )}`;
  const onLayout = () => {
    if (!!wrapperRef?.current) {
      wrapperRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          setwrpstate({
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          });

          Animated.timing(animate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      onLayout();
    }, [props.items])
  );

  return {
    type: "animated",
    className,
    onLayout,
    style,
    componentRef: wrapperRef,
  } as IView;
};

export const getBackdropProps = (
  props: ISelect,
  dropdownOpenState: any,
  animate: any
) => {
  const [_, setopen] = dropdownOpenState;
  const onDismiss = () => {
    Animated.timing(animate, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setopen(false);
    });
  };
  const cprops: TouchableOpacityProps = { ...props.backdropProps };
  cprops.onPress = onDismiss;
  cprops.activeOpacity = 1;
  cprops.style = {
    backgroundColor: "#00000000",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  return {
    ...cprops,
  };
};

export const getListProps = (props: ISelect, itemsState: any) => {
  const [items, _] = itemsState;
  const cprops: IList = trimObject(cloneDeep(get(props, "listProps", {})), [
    "data",
  ]);
  cprops.data = items;
  let rootStyle = {
    overflow: "hidden",
  };
  const selectedIndex = getSelectedIndex(props, items);

  if (selectedIndex > -1) {
    cprops.initialScrollIndex = selectedIndex;
  }

  return {
    ...cprops,
    rootStyle,
  } as IList;
};

export const getItemProps = (
  props: ISelect,
  dropdownOpenState: any,
  item: ListRenderItemInfo<any>
) => {
  const [_, setIsOpen] = dropdownOpenState;
  const cprops: IButton = get(props, "itemProps", {});
  let isActive = getValue(props, item.item) === props.value;
  let label = getLabel(props, item.item);

  const onPress = (e: any) => {
    setIsOpen(false);
    setTimeout(() => {
      let value = getValue(props, item.item);
      if (props.onChange) {
        props.onChange(value, item.item);
      }
    }, 100);
  };

  let className = `m-0 p-0 px-2 rounded-t-none bg-white border-b border-gray-200 text-gray-600 active:bg-gray-200 active:border-b-2 active:border-gray-400`;

  if (typeof Themes.inputStyle === "string") {
    className = `${className} ${Themes.inputStyle}`;
  }

  className = `${className} ${get(props, "itemProps.className", "")}`;

  const labelProps: IText = get(props, "labelProps", {});
  let lclassName = `flex-grow p-1 py-2 ${get(
    props,
    "labelProps.className",
    ""
  )}`;
  labelProps.className = lclassName;

  let renderItem = get(props, "listProps.renderItem", undefined);
  if (renderItem) {
    cprops.children = renderItem;
  }

  return {
    ...cprops,
    ...trimObject(item.item, ["value", "label"]),
    isActive,
    label,
    fill: true,
    onPress,
    className,
    labelProps,
  };
};

export const getFilterProps = (
  props: ISelect,
  filterState: any,
  btnPosState: any,
  buttonRef: any
) => {
  const [_, setposstate] = btnPosState;
  const [filter, setfilter] = filterState;
  const onChange = (value: string) => {
    setfilter(value);

    // donFilter(props, value);
  };
  const cprops: ITextInput = get(props, "filterProps", {});
  const getPos = () => {
    if (!!buttonRef.current) {
      buttonRef.current?.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          setposstate({
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          });
        }
      );
    }
  };
  const onFocus = (e: any) => {
    setTimeout(() => {
      getPos();
    }, 100);
    if (props.filterProps?.onFocus) {
      props.filterProps?.onFocus(e);
    }
  };
  const onBlur = (e: any) => {
    setTimeout(() => {
      getPos();
    }, 100);
    if (props.filterProps?.onBlur) {
      props.filterProps?.onBlur(e);
    }
  };
  cprops.value = filter;
  cprops.onChangeText = onChange;
  cprops.placeholder = "Search";

  const className = `z-10 ${get(props, "filterProps.className", "")}`;
  const wrapperProps = get(props, "filterProps.wrapperProps", {});
  const wclassName = `mt-0 ${get(wrapperProps, "className", "")}`;
  wrapperProps.className = wclassName;
  cprops.wrapperProps = wrapperProps;

  return { ...cprops, className, autoFocus: true, onFocus, onBlur };
};

const generateWrapperStyle = (
  props: ISelect,
  animate: any,
  btnpos: any,
  wrppos: any,
  keyboardHeight: number
) => {
  const btnPageX = get(btnpos, "pageX", 0),
    btnPageY = get(btnpos, "pageY", 0),
    btnWidth = get(btnpos, "width", 0),
    btnHeight = get(btnpos, "height", 0);
  const wpHeight = get(wrppos, "height", 0);
  let screenHeight = height - keyboardHeight;

  const style: StyleProp<ViewStyle> = {};
  let pX = "";
  let x = 0;
  let y = screenHeight;
  let lp = (btnPageX * 100) / width;
  let rp = ((width - (btnPageX + btnWidth)) * 100) / width;

  if (lp > rp) {
    pX = "right";
    x = width - (btnPageX + btnWidth);
  } else {
    pX = "left";
    x = btnPageX;
  }

  let pY = "top";
  const calcY = btnPageY + btnHeight + wpHeight;
  if (calcY !== NaN && calcY >= screenHeight) {
    pY = "bottom";
    if (Platform.OS === "ios") {
      y = height - btnPageY;
    } else {
      y = screenHeight - btnPageY;
    }
  } else if (calcY !== NaN && calcY < screenHeight) {
    pY = "top";
    y = btnPageY + btnHeight;
  }

  let maxWidth = undefined;
  let minWidth = undefined;
  const btnWidthP = ((btnWidth + x) * 100) / width;
  if (btnWidthP > 50) {
    maxWidth = btnWidth;
    minWidth = btnWidth;
  }
  if (btnWidthP <= 50) {
    minWidth = (50 * width) / 100;
    maxWidth = width - x;
  }

  Object.assign(
    style,
    tailwind("shadow-lg rounded"),
    parseStyleToObject(props.wrapperProps?.style),
    {
      display: !!btnpos ? "flex" : "none",
      position: "absolute",
      minWidth: minWidth,
      maxHeight: 250,
      maxWidth: maxWidth,
      [pY]: y,
      [pX]: x,
      justifyContent: "center",
      alignItems: "center",
      opacity: animate.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: animate.interpolate({
            inputRange: [0, 1],
            outputRange: [pY === "bottom" ? 20 : -20, 0],
          }),
        },
      ],
    } as StyleProp<ViewStyle>
  );

  return style;
};

export default getButtonProps;
