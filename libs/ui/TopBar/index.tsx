import { IComponent } from "../../../types/global";
import React from "react";
import Button, { IButton } from "../Button";
import Spinner, { ISpinner } from "../Spinner";
import Text, { IText } from "../Text";
import View from "../View";
import getTopBarProps, {
  getBackButtonProps,
  getSpinnerProps,
  getTitleProps,
} from "./generateProps";

export interface ITopBar extends IComponent {
  title?: string;
  titleProps?: IText;
  backButton?: boolean;
  backButtonProps?: IButton;
  isLoading?: boolean;
  spinnerProps?: ISpinner;
  leftAction?: JSX.Element;
  rightAction?: JSX.Element;
}

const TopBar = (props: ITopBar) => {
  const topBarProps = getTopBarProps(props);

  return (
    <View {...topBarProps}>
      <RenderBackButton {...props} />
      <RenderLeftAction {...props} />
      <RenderChildren {...props} />
      <RenderRightAction {...props} />
    </View>
  );
};

const RenderBackButton = (props: ITopBar) => {
  if (props.backButton) {
    const backButtonProps = getBackButtonProps(props);
    return <Button {...backButtonProps} />;
  }
  return null;
};
const RenderLeftAction = (props: ITopBar) => {
  if (props.leftAction) {
    return props.leftAction;
  }
  return null;
};
const RenderRightAction = (props: ITopBar) => {
  if (props.isLoading) {
    const spinnerProps = getSpinnerProps(props);
    return <Spinner {...spinnerProps} />;
  } else if (props.rightAction) {
    return props.rightAction;
  }
  return null;
};
const RenderChildren = (props: ITopBar) => {
  const titleProps = getTitleProps(props);
  if (props.children) {
    return props.children;
  }
  return <Text {...titleProps} />;
};

export default TopBar;
