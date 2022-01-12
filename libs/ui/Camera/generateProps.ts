import { useFocusEffect } from "@react-navigation/core";
import {
  Camera as RNCamera,
  CameraPictureOptions,
  CameraProps,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import imageResizer from "../../utils/image-resizer";
import Storage from "../../utils/storage";
import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get, set } from "lodash";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, BackHandler, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ICamera } from ".";
import { IButton } from "../Button";
import { IImage } from "../Image";
import { IModal } from "../Modal";
import { ISpinner } from "../Spinner";
import { IView } from "../View";

const CameraRef: any = createRef();

const initProps = (props: ICamera) => {
  const visibleState = useState(false);
  const [_, setvisibel] = visibleState;
  const animateRef = useRef(new Animated.Value(0));
  const animate = animateRef.current;
  const optionState = initCameraOption(props);
  const tempUriState = useState("");
  const loadingState = useState(false);
  const permissionState = useState(null);

  const runAnimation = () => {
    if (props.visible) {
      setvisibel(true);
      Animated.timing(animate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setvisibel(false);
        props.onClose();
      });
    }
  };

  useEffect(() => {
    runAnimation();
  }, [props.visible]);

  return {
    visibleState,
    optionState,
    tempUriState,
    loadingState,
    permissionState,
    animate,
  };
};

const initCameraOption = (props: ICamera) => {
  const [value, setValue] = useState({
    type: RNCamera.Constants.Type.back,
    flashMode: RNCamera.Constants.FlashMode.auto,
    ratio: "4:3", // 4:3, 16:9, 1:1
  });

  const onChange = async (data: any) => {
    Storage.set("camera-option", data);
    setValue(data);
  };

  const init = async () => {
    const sOption = await Storage.get("camera-option");
    const type = get(
      props,
      "cameraViewProps.type",
      RNCamera.Constants.Type.back
    );
    const flashMode = get(
      props,
      "cameraViewProps.flashMode",
      RNCamera.Constants.FlashMode.auto
    );
    const ratio = get(props, "cameraViewProps.ratio", "4:3");
    Object.assign(
      value,
      {
        type,
        flashMode,
        ratio,
      },
      sOption
    );
    onChange(value);
  };

  useEffect(() => {
    init();
  }, []);

  return [value, onChange];
};

const getPanelProps = (props: IModal, animate: any, visibleState: any) => {
  const [visible, _] = visibleState;
  const cprops = { ...props.panelProps };

  const style = generatePanelStyle(props, animate);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (visible) {
          props.onClose();
          return true;
        } else {
          return false;
        }
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [visible])
  );

  return {
    ...cprops,
    type: "animated",
    ref: props.componentRef,
    style,
  } as IView;
};

const getImageViewProps = (
  props: ICamera,
  tempUriState: any,
  optionState: any
) => {
  const [tempUri, _] = tempUriState;
  const [option, __] = optionState;
  let source = {};
  if (tempUri.indexOf("file://")) {
    source = {
      uri: tempUri,
    };
  } else {
    if (props.prefixValue) {
      source = {
        uri: `${props.prefixValue}${tempUri}`,
      };
    } else {
      source = {
        uri: tempUri,
      };
    }
    Object.assign(source, {
      headers: get(props, "sourceHeader", {}),
    });
  }

  const cprops: IImage = {
    ...get(props, "imagePreviewProps", {}),
    source,
  };
  const style = generateImageViewStyle(props, option);
  const className = `items-center justify-center ${get(
    props,
    "imagePreviewProps.className",
    ""
  )}`;

  return {
    ...cprops,
    className,
    style,
    ref: get(props, "imagePreviewProps.componentRef", undefined),
  };
};

const getCameraViewProps = (
  props: ICamera,
  loadingState: any,
  permissionState: any,
  optionState: any,
  tempUriState: any
) => {
  const [isLoading, setLoading] = loadingState;
  const [_, setPermission] = permissionState;
  const [option, __] = optionState;
  const [tempUri, setUri] = tempUriState;
  const checkPermission = async () => {
    const { status } = await RNCamera.getCameraPermissionsAsync();
    setPermission(status === "granted");
  };
  const checkValue = () => {
    if (props.uri !== tempUri) {
      setUri(props.uri);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setLoading(false);
    }
    checkPermission();
  }, []);

  useEffect(() => {
    checkValue();
  }, [props.uri]);

  const cprops: CameraProps = { ...props.cameraViewProps };
  const style = generateCameraStyle(props, option);
  const setRef = (ref: any) => {
    CameraRef.current = ref;
    if (props.cameraViewProps?.componentRef) {
      set(props, "cameraViewProps.componentRef.current", ref);
    }
  };

  return {
    ...cprops,
    style,
    ref: setRef,
  };
};

const getLoadingProps = (props: ICamera) => {
  const cprops: ISpinner = {
    ...get(props, "loadingProps", {}),
    size: "large",
  };
  const wrapperProps = {
    ...get(props, "loadingProps.wrapperProps", {}),
    className: `absolute top-0 left-0 right-0 bottom-0 justify-center items-center ${get(
      props,
      "loadingProps.wrapperProps.className",
      ""
    )}`,
  };
  const className = `p-4 rounded-md self-center bg-white dark:bg-gray-800 bg-opacity-50 ${get(
    props,
    "loadingProps.className",
    ""
  )}`;

  return {
    ...cprops,
    wrapperProps,
    className,
    ref: get(props, "loadingProps.componentRef", undefined),
  };
};

const getPermissionProps = (permissionState: any) => {
  const [_, setPermission] = permissionState;
  const onPress = async () => {
    const { status } = await RNCamera.requestCameraPermissionsAsync();
    setPermission(status === "granted");
  };
  const cprops: IButton = {
    label: "Enable Camera Access",
    onPress,
    variant: "link",
    className: "text-blue-600 bg-gray-100 bg-opacity-25",
  };

  return cprops;
};

const getFlashProps = (optionState: any) => {
  const [option, setOption] = optionState;
  const { flashMode } = option;
  const cprops: IButton = {
    prefix:
      flashMode !== RNCamera.Constants.FlashMode.auto
        ? {
            name:
              flashMode === RNCamera.Constants.FlashMode.on
                ? "flash"
                : "flash-off",
            size: 24,
          }
        : undefined,
    label: flashMode === RNCamera.Constants.FlashMode.auto ? "Auto" : "",
    variant: "link",
    className: "text-white text-base bg-gray-100 bg-opacity-25 w-16 h-12",
  };
  const onPress = () => {
    let { flashMode } = option;
    switch (flashMode) {
      case RNCamera.Constants.FlashMode.auto:
        flashMode = RNCamera.Constants.FlashMode.on;
        break;
      case RNCamera.Constants.FlashMode.off:
        flashMode = RNCamera.Constants.FlashMode.auto;
        break;
      case RNCamera.Constants.FlashMode.on:
      default:
        flashMode = RNCamera.Constants.FlashMode.off;
        break;
    }
    setOption({
      ...option,
      flashMode,
    });
  };

  return {
    ...cprops,
    onPress,
  };
};

const getCameraTypeProps = (optionState: any) => {
  const [option, setOption] = optionState;
  const cprops: IButton = {
    prefix: {
      name: "camera-reverse",
      size: 35,
    },
    variant: "link",
    className: "text-white text-base bg-gray-100 bg-opacity-25 w-16 h-16",
    size: "custom",
  };
  const onPress = () => {
    let { type } = option;
    switch (type) {
      case RNCamera.Constants.Type.back:
        type = RNCamera.Constants.Type.front;
        break;
      case RNCamera.Constants.Type.front:
      default:
        type = RNCamera.Constants.Type.back;
        break;
    }
    setOption({
      ...option,
      type,
    });
  };

  return {
    ...cprops,
    onPress,
  };
};

const getRatioProps = (optionState: any) => {
  const [option, setOption] = optionState;
  const { ratio } = option;
  const cprops: IButton = {
    label: `[${ratio}]`,
    variant: "link",
    className: "text-white text-base bg-gray-100 bg-opacity-25 w-16 h-12",
  };
  const onPress = () => {
    let { ratio } = option;
    switch (ratio) {
      case "1:1":
        ratio = "4:3";
        break;
      case "4:3":
        ratio = "16:9";
        break;
      case "16:9":
      default:
        ratio = "1:1";
        break;
    }
    setOption({
      ...option,
      ratio,
    });
  };

  return {
    ...cprops,
    onPress,
  };
};

const getCameraCaptureProps = (
  props: ICamera,
  tempUriState: any,
  loadingState: any
) => {
  const [tempUri, setUri] = tempUriState;
  const [isLoading, setLoading] = loadingState;
  const compressImage = get(props, "cameraViewProps.compressImage", false);
  const compressImageProps = get(
    props,
    "cameraViewProps.compressImageProps",
    {}
  );
  const cprops: IButton = {
    prefix: {
      name: !!tempUri ? "reload" : "radio-button-on",
      size: !!tempUri ? 35 : 70,
      className: "pl-1 pt-1",
    },
    variant: "link",
    className: `text-white text-base bg-gray-100 bg-opacity-25 p-0 m-0 ${
      !!tempUri ? "w-16 h-16" : "w-24 h-24 rounded-full"
    }`,
    size: "custom",
    disabled: isLoading,
  };
  const option: CameraPictureOptions = {};
  Object.assign(
    option,
    {
      quality: 0.8,
      base64: false,
    },
    get(props, "cameraViewProps.option", {})
  );

  const actionSnap = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const Camera = CameraRef.current;
        if (!!Camera) {
          setLoading(true);
          Camera.takePictureAsync(option)
            .then(async (res: any) => {
              let uri = res.uri;
              if (compressImage === true) {
                await imageResizer({
                  ...compressImageProps,
                  uri,
                })
                  .then((res) => {
                    if (!!res) {
                      uri = res;
                    }
                  })
                  .catch((e) => console.warn(e));
              }
              setUri(uri);
              setLoading(false);
              resolve(uri);
            })
            .catch((e: any) => {
              let msg = e?.message;
              if (!msg) {
                msg = "Failed to take a picture. Please try again.";
              }
              if (!!isLoading) {
                setLoading(false);
              }
              Alert.alert("Alert", msg);
              reject(null);
            });
        }
      } catch (error: any) {
        let msg = error?.message;
        if (!msg) {
          msg = "Failed to take a picture. Please try again.";
        }
        if (!!isLoading) {
          setLoading(false);
        }
        Alert.alert("Alert", msg);
        reject(null);
      }
    });
  };

  const actionReset = () => {
    if (!!tempUri) {
      setUri("");
    }
  };

  const onPress = async () => {
    if (!!tempUri) {
      actionReset();
    } else {
      await actionSnap();
    }
  };

  return {
    ...cprops,
    onPress,
  };
};

const getImagePickerProps = (props: ICamera, tempUriState: any) => {
  const [tempUri, setUri] = tempUriState;
  const option: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    ...props.imagePickerProps,
  };
  const compressImage = get(props, "cameraViewProps.compressImage", false);
  const compressImageProps = get(
    props,
    "cameraViewProps.compressImageProps",
    {}
  );
  const onPress = async () => {
    const res = await ImagePicker.launchImageLibraryAsync(option);
    if (!res.cancelled) {
      let uri = res.uri;
      if (compressImage === true) {
        await imageResizer({
          ...compressImageProps,
          uri,
        })
          .then((res) => {
            if (!!res) {
              uri = res;
            }
          })
          .catch((e) => console.warn(e));
      }
      setUri(uri);
    }
  };
  const cprops: IButton = {
    prefix: {
      name: "images",
      size: 30,
    },
    variant: "link",
    className: `text-white text-base bg-gray-100 bg-opacity-25 w-16 h-16 ${
      props.imagePicker === false ? "opacity-0" : "opacity-100"
    }`,
    size: "custom",
    disabled: props.imagePicker === false,
  };

  return {
    ...cprops,
    onPress,
  };
};

const getSaveImageProps = (props: ICamera, tempUriState: any) => {
  const [tempUri, _] = tempUriState;
  const onPress = async () => {
    props.onChange(tempUri);
    props.onClose();
  };
  const cprops: IButton = {
    prefix: {
      name: "checkmark-circle",
      size: 70,
      className: "pl-1",
    },
    variant: "link",
    className: `m-0 text-white text-base self-end bg-gray-100 bg-opacity-25 rounded-full w-24 h-24`,
    size: "custom",
  };

  return {
    ...cprops,
    onPress,
  };
};

export const getBackProps = (
  props: ICamera,
  visibleState: any,
  animate: any
) => {
  const [_, setvisibel] = visibleState;
  const cprops: IButton = {
    prefix: {
      name: "arrow-back",
      size: 26,
    },
    variant: "link",
    className: "text-white text-base bg-gray-100 bg-opacity-25 w-16 h-12",
  };
  const onPress = () => {
    Animated.timing(animate, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setvisibel(false);
      props.onClose();
    });
  };

  return {
    ...cprops,
    onPress,
  };
};

export const getWrapperProps = (props: ICamera) => {
  const cprops = { ...props.wrapperProps };
  const className = `flex-1`;

  return {
    ...cprops,
    className,
  };
};

export const getWrapperBottomActionProps = (props: ICamera) => {
  const inner = useSafeAreaInsets();
  const style: any = tailwind(
    `flex flex-row justify-between px-4 absolute bottom-0 left-0 right-0 items-end bg-black bg-opacity-50`
  );
  const paddingBottom =
    get(style, "paddingBottom", get(style, "paddingBottom", 0)) + inner.top;

  Object.assign(style, {
    paddingBottom,
  });

  return {
    style,
  };
};

export const getWrapperTopActionProps = (props: ICamera) => {
  const inner = useSafeAreaInsets();
  const style: any = tailwind(
    `flex flex-row justify-between px-4 absolute top-0 left-0 right-0 items-end bg-black bg-opacity-50`
  );
  const paddingTop =
    get(style, "paddingTop", get(style, "padding", 0)) + inner.top;

  Object.assign(style, {
    paddingTop,
  });

  return {
    style,
  };
};
const generateCameraStyle = (props: ICamera, option: any) => {
  let style: any = {};
  const { width, height } = Dimensions.get("window");
  const arrratio = get(option, "ratio", "4:3").split(":");
  const nwidth = width;
  const nheight = width * (Number(arrratio[0]) / Number(arrratio[1]));
  const className = `bg-white ${get(props, "cameraViewProps.className", "")}`;

  Object.assign(
    style,
    tailwind(className),
    parseStyleToObject(props.cameraViewProps?.style),
    {
      top: (height - nheight) / 2,
      minWidth: nwidth,
      minHeight: nheight,
      maxWidth: nwidth,
      maxHeight: nheight,
    }
  );

  return style;
};

const generateImageViewStyle = (props: ICamera, option: any) => {
  let style: any = {};
  const { width, height } = Dimensions.get("window");
  const arrratio = option.ratio.split(":");
  const nwidth = width;
  const nheight = width * (Number(arrratio[0]) / Number(arrratio[1]));

  Object.assign(
    style,
    parseStyleToObject(get(props, "imagePreviewProps.style", {})),
    {
      top: (height - nheight) / 2,
      minWidth: nwidth,
      minHeight: nheight,
      maxWidth: nwidth,
      maxHeight: nheight,
    }
  );

  return style;
};

const generatePanelStyle = (props: IModal, animate: any) => {
  const style = {};
  let className = "bg-black flex absolute top-0 left-0 right-0 bottom-0";
  className = `${className} ${get(props, "panelProps.className", "")}`;
  Object.assign(style, tailwind(className), {
    opacity: animate.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0, 1, 1],
    }),
  });

  Object.assign(style, {
    transform: [
      {
        translateY: animate.interpolate({
          inputRange: [0, 0.3, 0.7, 1],
          outputRange: [300, 100, 0, 0],
        }),
      },
    ],
  });

  return style;
};

export {
  initProps,
  getImageViewProps,
  getCameraViewProps,
  getLoadingProps,
  initCameraOption,
  getPermissionProps,
  getFlashProps,
  getRatioProps,
  getCameraTypeProps,
  getCameraCaptureProps,
  getImagePickerProps,
  getSaveImageProps,
  getPanelProps,
};
