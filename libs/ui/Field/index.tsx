import { IComponent } from "../../../types/global";
import React from "react";
import Select, { ISelect } from "../Select";
import Checkbox, { ICheckbox } from "../Checkbox";
import CameraInput, { ICameraInput } from "../CameraInput";
import Text, { IText } from "../Text";
import TextInput, { ITextInput, TInputType } from "../TextInput";
import View from "../View";
import getFieldProps, {
  getCaptionProps,
  getErrorProps,
  getInputProps,
  getLabelProps,
} from "./generateProps";
import DateTimeInput, { IDateTimeInput } from "../DateTimeInput";

export interface IField extends IComponent {
  label: string;
  path: string;
  labelProps?: IText;
  hiddenLabel?: boolean;
  caption?: string | JSX.Element;
  captionProps?: IText;
  type?:
    | TInputType
    | "select"
    | "camera"
    | "checkbox"
    | "date"
    | "datetime"
    | "time";
  inputProps?: ITextInput | ISelect | ICameraInput | ICheckbox | IDateTimeInput;
  error?: string;
  errorProps?: IText;
  readonly?: boolean;
  onChange?: (value: any) => void;
}

const Field = (props: IField) => {
  const fieldProps = getFieldProps(props);

  return (
    <View {...fieldProps}>
      <RenderLabel {...props} />
      <RenderInput {...props} />
      <RenderCaption {...props} />
      <RenderError {...props} />
    </View>
  );
};

const RenderInput = (props: IField) => {
  const inputProps: any = getInputProps(props);
  switch (props.type) {
    case "select":
      delete inputProps.type;
      inputProps.defaultValue = inputProps.value;
      return <Select {...inputProps} />;
    case "camera":
      delete inputProps.type;
      return <CameraInput {...inputProps} />;
    case "checkbox":
      delete inputProps.type;
      return <Checkbox {...inputProps} />;
    case "date":
    case "time":
    case "datetime":
      inputProps.mode = props.type;
      return <DateTimeInput {...inputProps} />;
    default:
      return <TextInput {...inputProps} type={props.type} />;
  }
};

const RenderLabel = (props: IField) => {
  const { label, hiddenLabel } = props;
  const labelProps = getLabelProps(props);
  if (!hiddenLabel && (label || labelProps.children)) {
    if (!!labelProps.children) {
      return labelProps.children;
    } else {
      return <Text {...labelProps}>{label}</Text>;
    }
  }

  return null;
};

const RenderCaption = (props: IField) => {
  const { caption } = props;
  if (caption) {
    if (typeof caption === "string") {
      const captionProps = getCaptionProps(props);
      return <Text {...captionProps}>{caption}</Text>;
    } else {
      return caption;
    }
  }
  return null;
};

const RenderError = (props: any) => {
  const errorProps = getErrorProps(props);

  if (errorProps.children) {
    return <Text {...errorProps} />;
  }
  return null;
};

export default Field;
