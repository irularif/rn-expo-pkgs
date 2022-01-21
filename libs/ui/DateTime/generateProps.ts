import { AndroidNativeProps } from "@react-native-community/datetimepicker";
import { dateParse } from "../../utils/date";
import { trimObject } from "../../utils/misc";
import { get } from "lodash";
import { useEffect, useRef } from "react";
import { Platform, TouchableOpacityProps } from "react-native";
import { IDateTime, IModalProps } from ".";

const parseValue = (value: any) => {
  let nval = new Date();
  if (!!value) {
    if (typeof value === "string") {
      nval = dateParse(value);
    } else if (value instanceof Date) {
      nval = value;
    }
  }

  return nval;
};

const initProps = (props: IDateTime, dateState: any, modeState: any) => {
  const [__, settempdate] = dateState;
  const [_, setmode] = modeState;

  useEffect(() => {
    if (props.mode === "time") {
      setmode("time");
    }
  }, []);

  useEffect(() => {
    settempdate(parseValue(props.value));
  }, [props.value]);
};

const getModalProps = (props: IDateTime) => {
  const cprops: IModalProps = {
    ...get(props, "modalProps", {}),
    visible: props.isOpen,
    onClose: props.onClose,
    position: "center",
    wrapperProps: {
      ...get(props, "modalProps.wrapperProps", {}),
    },
  };

  return {
    ...cprops,
    ref: cprops.componentRef,
  } as IModalProps;
};

const getDateTimeProps = (
  props: IDateTime,
  dateState: any,
  modeState: any,
  iosEv: any = {}
) => {
  const [mode, setmode] = modeState;
  const [tempDate, settempdate] = dateState;
  const cprops = trimObject(props, [
    "modalProps",
    "backdropProps",
    "visible",
    "onClose",
    "isOpen",
  ]);
  cprops.value = tempDate;
  cprops.mode = mode;
  if (Platform.OS === "ios") {
    cprops.display = "spinner";
  }

  const onChange = (ev: any, date: Date) => {
    if (Platform.OS === "android") {
      if (ev.type === "dismissed") {
        props.onClose();
        if (props.mode !== "time" && mode === "time") {
          setmode("date");
        }
      } else {
        if (props.mode === "datetime") {
          if (mode === "time") {
            props.onClose();
            settempdate(date);
            setmode("date");
            if (!!props.onChange) {
              props.onChange(ev, date);
            }
          } else {
            settempdate(date);
            setmode("time");
          }
        } else {
          props.onClose();
          settempdate(date);
          if (!!props.onChange) {
            props.onChange(ev, date);
          }
        }
      }
    } else {
      settempdate(date);
      iosEv.current = ev;
    }
  };

  const style = {
    width: 300,
  };

  return {
    ...cprops,
    onChange,
    style,
  } as AndroidNativeProps;
};

const getActionIos = (
  props: IDateTime,
  dateState: any,
  modeState: any,
  iosEv: any
) => {
  const [mode, setmode] = modeState;
  const [tempDate, _] = dateState;

  const onCancel = () => {
    if (props.mode !== "time" && mode === "time") {
      setmode("date");
    }
    props.onClose();
  };
  const onSubmit = (ev: any) => {
    if (props.mode !== "time" && mode === "time") {
      setmode("date");
      if (!!props.onChange) {
        props.onChange(iosEv?.current, tempDate);
      }
      props.onClose();
    } else {
      if (props.mode === "datetime") {
        setmode("time");
      } else {
        if (!!props.onChange) {
          props.onChange(iosEv?.current, tempDate);
        }
        props.onClose();
      }
    }
  };

  return {
    onCancel,
    onSubmit,
  };
};

const getBackdropProps = (props: IDateTime) => {
  const cprops: TouchableOpacityProps = get(props, "backdropProps", {});
  cprops.onPress = props.onClose;
  cprops.activeOpacity = 0.8;
  cprops.style = {
    backgroundColor: "#00000030",
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

export { getDateTimeProps, getBackdropProps, initProps, getActionIos };

export default getModalProps;
