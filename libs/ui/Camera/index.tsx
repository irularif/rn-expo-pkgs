import {
  Camera as RNCamera,
  CameraPictureOptions,
  CameraProps,
} from "expo-camera";
import { ImagePickerOptions } from "expo-image-picker";
import { IComponent } from "../../../types/global";
import { IImageResizer } from "../../utils/image-resizer";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "../Button";
import Image, { IImage } from "../Image";
import Portal from "../Portal";
import { ISpinner } from "../Spinner";
import Text from "../Text";
import View, { IView } from "../View";
import {
  getBackProps,
  getCameraCaptureProps,
  getCameraTypeProps,
  getCameraViewProps,
  getFlashProps,
  getImagePickerProps,
  getImageViewProps,
  getPanelProps,
  getPermissionProps,
  getRatioProps,
  getSaveImageProps,
  getWrapperBottomActionProps,
  getWrapperProps,
  getWrapperTopActionProps,
  initProps,
} from "./generateProps";

export interface ICameraView extends IComponent, CameraProps {
  option?: CameraPictureOptions;
  compressImage?: boolean;
  compressImageProps?: Partial<IImageResizer>;
  children?: undefined;
}

export interface ICamera {
  uri: string;
  onChange: (uri: string) => void;
  prefixValue?: string;
  sourceHeader?: {
    [key: string]: string;
  };
  cameraViewProps?: ICameraView;
  imagePreviewProps?: IImage;
  loadingProps?: ISpinner;
  imagePicker?: boolean;
  imagePickerProps?: ImagePickerOptions;
  wrapperProps?: IView;
  visible: boolean;
  onClose: () => void;
}

const Camera = (props: ICamera) => {
  return (
    <Portal hostName="libs">
      <CameraPanel {...props} />
    </Portal>
  );
};

const CameraPanel = (props: ICamera) => {
  const {
    visibleState,
    optionState,
    tempUriState,
    loadingState,
    permissionState,
    animate,
  } = initProps(props);
  const [visible, _] = visibleState;
  const panelProps = getPanelProps(props, animate, visibleState);
  const wrapperProps = getWrapperProps(props);

  if (visible) {
    return (
      <View {...panelProps}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" />
          <View {...wrapperProps}>
            <CameraView
              panelProps={props}
              tempUriState={tempUriState}
              loadingState={loadingState}
              optionState={optionState}
              permissionState={permissionState}
            />
            <TopActionGroup
              panelProps={props}
              visibleState={visibleState}
              tempUriState={tempUriState}
              optionState={optionState}
              permissionState={permissionState}
              animate={animate}
            />
            <BottomActionGroup
              panelProps={props}
              loadingState={loadingState}
              tempUriState={tempUriState}
              optionState={optionState}
              permissionState={permissionState}
            />
          </View>
        </SafeAreaProvider>
      </View>
    );
  }

  return null;
};

const CameraView = (props: any) => {
  const [option, ___] = props.optionState;
  const [tempUri, _] = props.tempUriState;
  const [hasPermission, ____] = props.permissionState;

  const cameraViewProps = getCameraViewProps(
    props.panelProps,
    props.loadingState,
    props.permissionState,
    props.optionState,
    props.tempUriState
  );
  // const loadingProps = getLoadingProps(props.panelProps);
  if (hasPermission === false) {
    return (
      <PermissionView
        panelProps={props.panelProps}
        permissionState={props.permissionState}
      />
    );
  }

  if (!!tempUri) {
    const imageViewProps = getImageViewProps(
      props.panelProps,
      props.tempUriState,
      props.optionState
    );
    return <Image {...imageViewProps} />;
  }

  if (!!hasPermission && !tempUri) {
    return (
      <>
        <RNCamera {...cameraViewProps} {...option}></RNCamera>
        {/* {!!isLoading && <Spinner {...loadingProps} />} */}
      </>
    );
  }

  return null;
};

const PermissionView = (props: any) => {
  const buttonProps = getPermissionProps(props.permissionState);

  return (
    <View className="flex flex-1 justify-center items-center p-8">
      <Text className="text-white font-bold text-xl">Camera</Text>
      <Text className="text-white mb-4">
        Enable access so you can start taking photos.
      </Text>
      <Button {...buttonProps} />
    </View>
  );
};

const TopActionGroup = (props: any) => {
  const [tempUri, _] = props.tempUriState;
  const [hasPermission, ____] = props.permissionState;
  const backProps = getBackProps(
    props.panelProps,
    props.visibleState,
    props.animate
  );
  const wrapperTopActionProps = getWrapperTopActionProps(props.panelProps);

  if (!!hasPermission && !tempUri) {
    const flashProps = getFlashProps(props.optionState);
    const ratioProps = getRatioProps(props.optionState);
    return (
      <View {...wrapperTopActionProps}>
        <Button {...backProps} />
        <Button {...ratioProps} />
        <Button {...flashProps} />
      </View>
    );
  }

  if (!hasPermission || !!tempUri) {
    return (
      <View {...wrapperTopActionProps}>
        <Button {...backProps} />
      </View>
    );
  }

  return null;
};

const BottomActionGroup = (props: any) => {
  const [tempUri, _] = props.tempUriState;
  const [hasPermission, ____] = props.permissionState;
  const cameraCaptureProps = getCameraCaptureProps(
    props.panelProps,
    props.tempUriState,
    props.loadingState
  );
  const wrapperBottomActionProps = getWrapperBottomActionProps(
    props.panelProps
  );

  if (!!hasPermission && !tempUri) {
    const cameraTypeProps = getCameraTypeProps(props.optionState);
    const pickerProps = getImagePickerProps(
      props.panelProps,
      props.tempUriState
    );
    return (
      <View {...wrapperBottomActionProps}>
        <Button {...pickerProps} />
        <Button {...cameraCaptureProps} />
        <Button {...cameraTypeProps} />
      </View>
    );
  }

  if (!!hasPermission) {
    const saveProps = getSaveImageProps(props.panelProps, props.tempUriState);
    return (
      <View {...wrapperBottomActionProps}>
        <Button {...cameraCaptureProps} />
        <Button {...saveProps} />
        <View className="w-10" />
      </View>
    );
  }

  return null;
};

export default Camera;
