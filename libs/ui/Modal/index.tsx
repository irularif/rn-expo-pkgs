import React, { ReactNode } from "react";
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Portal from "../Portal";
import ScrollView, { IScrollView } from "../ScrollView";
import View, { IView } from "../View";
import {
  getBackdropProps,
  getButtonBackdropProps,
  getPanelProps,
  getWrapperProps,
  init,
} from "./generateProps";

interface IBackdrop extends IView, TouchableOpacityProps {
  children?: any;
}

export interface IModal {
  backdropProps?: IBackdrop;
  wrapperProps?: IView;
  panelProps?: IView;
  children?: any;
  componentRef?: any;
  position?: "top" | "bottom" | "center" | "full";
  className?: string;
  style?: StyleProp<ViewStyle>;
  visible: boolean;
  onClose: () => void;
}

const Modal = (props: IModal) => {
  const { visibleState, animate } = init(props);

  return (
    <Portal hostName="libs">
      <RenderModal
        modalProps={props}
        animate={animate}
        visibleState={visibleState}
      />
    </Portal>
  );
};

const RenderModal = (props: any) => {
  const [visible] = props.visibleState;
  const backdropProps = getBackdropProps(props.modalProps, props.animate);
  const buttonProps = getButtonBackdropProps(props.modalProps, props.animate);
  const panelProps = getPanelProps(props.modalProps, props.animate);
  const wrapperProps = getWrapperProps(props.modalProps, props.animate);

  if (visible) {
    return (
      <>
        <View {...backdropProps}></View>
        <View {...panelProps}>
          <TouchableOpacity {...buttonProps} />
          <View {...wrapperProps}>{props.modalProps.children}</View>
        </View>
      </>
    );
  }

  return null;
};

export default Modal;
