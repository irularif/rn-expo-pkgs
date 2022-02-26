import { IComponent } from "../../../types/global";
import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";
import View, { IView } from "../View";
import getSpinnerProps, { getWrapperProps } from "./generateProps";

export interface ISpinner extends IComponent, ActivityIndicatorProps {
  wrapperProps?: IView;
  children?: any;
}

const Spinner = (props: ISpinner) => {
  const spinnerProps = getSpinnerProps(props);
  const wrapperProps = getWrapperProps(props);

  return (
    <View {...wrapperProps}>
      <ActivityIndicator {...spinnerProps} />
    </View>
  );
};

export default Spinner;
