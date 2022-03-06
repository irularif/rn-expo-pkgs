import DateTimePicker, {
  AndroidNativeProps,
} from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import { Omit, Platform, TouchableOpacityProps } from "react-native";
import Button from "../Button";
import View from "../View";
import Modal, { IModal } from "../Modal";
import getModalProps, {
  getActionIos,
  getBackdropProps,
  getDateTimeProps,
  initProps,
} from "./generateProps";

export interface IModalProps extends IModal {
  children?: undefined;
}

export interface IDateTime extends Omit<AndroidNativeProps, "mode"> {
  backdropProps?: TouchableOpacityProps;
  modalProps?: IModalProps;
  isOpen: boolean;
  onClose: () => void;
  mode?: "datetime" | "date" | "time";
}

const DateTime = (props: IDateTime) => {
  const dateState = useState(new Date());
  const modeState = useState("date");
  initProps(props, dateState, modeState);

  if (Platform.OS === "ios") {
    return (
      <DatePickerIOS
        dateProps={props}
        dateState={dateState}
        modeState={modeState}
      />
    );
  }

  return (
    <DatePickerAndroid
      dateProps={props}
      dateState={dateState}
      modeState={modeState}
    />
  );
};

const DatePickerIOS = (props: any) => {
  const iosEv = useRef();
  const modalProps = getModalProps(props.dateProps);

  if (props.dateProps.isOpen) {
    const dateTimeProps = getDateTimeProps(
      props.dateProps,
      props.dateState,
      props.modeState,
      iosEv
    );

    const { onCancel, onSubmit } = getActionIos(
      props.dateProps,
      props.dateState,
      props.modeState,
      iosEv
    );
    return (
      <Modal {...modalProps}>
        <DateTimePicker {...dateTimeProps} />
        <View className="flex-row justify-end p-2">
          <Button
            label="CANCEL"
            variant="link"
            onPress={onCancel}
            className="py-2"
          />
          <Button
            label="OK"
            variant="link"
            onPress={onSubmit}
            className="py-2"
          />
        </View>
      </Modal>
    );
  }

  return null;
};

const DatePickerAndroid = (props: any) => {
  if (props.dateProps.isOpen) {
    const dateTimeProps = getDateTimeProps(
      props.dateProps,
      props.dateState,
      props.modeState
    );
    return <DateTimePicker {...dateTimeProps} />;
  }

  return null;
};

export default DateTime;
