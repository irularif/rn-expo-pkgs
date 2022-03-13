import React, { memo } from "react";
import { SafeAreaView, StatusBar, StatusBarProps } from "react-native";
import View, { IView } from "../View";
import getViewProps, { getStatusBarProps } from "./generateProps";

export interface IPage extends IView {
  statusBarProps?: StatusBarProps;
}

const Page = (props: IPage) => {
  const statusBarProps = getStatusBarProps(props);
  const viewProps = getViewProps(props);

  return (
    <View {...viewProps}>
      <StatusBar {...statusBarProps} />
      {props.children}
    </View>
  );
};

export default memo(Page);
