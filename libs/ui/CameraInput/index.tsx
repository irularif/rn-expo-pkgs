import React, {useState} from 'react';
import Icon from '../Icon';
import Button, {IButton} from '../Button';
import {IIcon} from '../Icon';
import Image, {IImage} from '../Image';
import Text, {IText} from '../Text';
import Camera, {ICamera} from '../Camera';
import getPickerProps, {
  getClearButtonProps,
  getIconProps,
  getImagePreviewProps,
  getPanelCameraProps,
  getTextProps,
  getUriProps,
} from './generateProps';

export interface ICameraInput extends IButton {
  value: string;
  imagePreviewProps?: IImage;
  iconPreviewProps?: IIcon;
  textPreviewProps?: IText;
  clearButton?: boolean;
  clearButtonProps?: IButton;
  prefixValue?: string;
  sourceHeader?: {
    [key: string]: string;
  };
  panelCameraProps?: ICamera;
  onChange: (value: string) => void;
}

const CameraInput = (props: ICameraInput) => {
  const panelState = useState(false);
  const valueState = useState('');
  const pickerProps = getPickerProps(props, panelState, valueState);

  return (
    <>
      <Button {...pickerProps}>
        <ImagePreview
          inputProps={props}
          panelState={panelState}
          valueState={valueState}
        />
      </Button>

      <CameraPanel
        inputProps={props}
        panelState={panelState}
        valueState={valueState}
      />
    </>
  );
};

const ImagePreview = (props: any) => {
  const [value, _] = props.valueState;

  if (!!value) {
    const imagePreviewProps = getImagePreviewProps(
      props.inputProps,
      props.valueState,
    );
    const clearButtonProps = getClearButtonProps(
      props.inputProps,
      props.valueState,
    );
    const uriProps = getUriProps(props.valueState);
    return (
      <>
        <Image {...imagePreviewProps} />
        <Button {...clearButtonProps} />
        <Text {...uriProps} />
      </>
    );
  }

  const iconProps = getIconProps(props.inputProps);
  const textProps = getTextProps(props.inputProps);

  return (
    <>
      <Icon {...iconProps} />
      <Text {...textProps} />
    </>
  );
};

const CameraPanel = (props: any) => {
  const panelCameraProps = getPanelCameraProps(
    props.inputProps,
    props.panelState,
    props.valueState,
  );

  return <Camera {...panelCameraProps} />;
};

export default CameraInput;
