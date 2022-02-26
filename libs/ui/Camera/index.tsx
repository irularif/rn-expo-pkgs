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
import Button, { IButton } from "../Button";
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
  buttonGalleryProps?: IButton;
  saveButtonProps?: IButton;
  captureButtonProps?: IButton;
  backButtonProps?: IButton;
  ratioButtonProps?: IButton;
  flashButtonProps?: IButton;
  cameraButtonProps?: IButton;
  reloadButtonProps?: IButton;
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
    cameraState,
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
              cameraState={cameraState}
              permissionState={permissionState}
            />
            <TopActionGroup
              panelProps={props}
              visibleState={visibleState}
              tempUriState={tempUriState}
              cameraState={cameraState}
              permissionState={permissionState}
              animate={animate}
            />
            <BottomActionGroup
              panelProps={props}
              loadingState={loadingState}
              tempUriState={tempUriState}
              cameraState={cameraState}
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
  const [tempUri, _] = props.tempUriState;
  const [hasPermission, ____] = props.permissionState;

  const cameraViewProps = getCameraViewProps(
    props.panelProps,
    props.loadingState,
    props.permissionState,
    props.tempUriState
  );

  const imageViewProps = getImageViewProps(
    props.panelProps,
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
    return <Image {...imageViewProps} />;
  }

  if (!!hasPermission && !tempUri) {
    return (
      <>
        <RNCamera {...cameraViewProps} {...props.cameraState}></RNCamera>
        {/* {!!isLoading && <Spinner {...loadingProps} />} */}
      </>
    );
  }

  return null;
};

const PermissionView = (props: any) => {
  const buttonProps = getPermissionProps(
    props.panelProps,
    props.permissionState
  );

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
  const flashProps = getFlashProps(props.panelProps);
  const ratioProps = getRatioProps(props.panelProps);

  if (!!hasPermission && !tempUri) {
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
  const cameraTypeProps = getCameraTypeProps(props.panelProps);
  const pickerProps = getImagePickerProps(props.panelProps, props.tempUriState);
  const saveProps = getSaveImageProps(props.panelProps, props.tempUriState);

  if (!!hasPermission) {
    return (
      <View {...wrapperBottomActionProps}>
        <Button {...pickerProps} />
        {!!tempUri ? (
          tempUri !== props.panelProps.uri && <Button {...saveProps} />
        ) : (
          <Button {...cameraCaptureProps} />
        )}
        {!tempUri ? (
          <Button {...cameraTypeProps} />
        ) : (
          <Button {...cameraCaptureProps} />
        )}
      </View>
    );
  }

  // if (!!hasPermission) {
  //   return (
  //     <View {...wrapperBottomActionProps}>
  //       <Button {...cameraCaptureProps} />
  //       <Button {...saveProps} />
  //       <View className="w-16" />
  //     </View>
  //   );
  // }

  return null;
};

export default Camera;
