import React from "react";
import Button, { IButton } from "../Button";
import { IIcon } from "../Icon";
import getCheckboxProps from "./generateProps";

export interface ICheckbox extends Omit<IButton, "prefix" | "suffix"> {
  value?: boolean;
  onChange?: (value: boolean) => void;
  position?: "left" | "right";
  activeClassName?: string;
  prefix?: Partial<IIcon> | JSX.Element;
  suffix?: Partial<IIcon> | JSX.Element;
}

const Checkbox = (props: ICheckbox) => {
  const buttonProps = getCheckboxProps(props);

  return <Button {...buttonProps} />;
};

export default Checkbox;
