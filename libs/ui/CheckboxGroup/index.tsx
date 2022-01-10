import { IItem } from "../../../types/global";
import { get } from "lodash";
import React from "react";
import { Button, View } from "..";
import { IButton } from "../Button";
import Checkbox, { ICheckbox } from "../Checkbox";
import { IView } from "../View";
import getCheckboxProps, {
  getCheckboxWithChildProps,
  getTitleProps,
  getWrapperProps,
} from "./generateProps";

export interface ICheckboxItem extends IItem, Partial<ICheckboxGroup> {}

export interface ICheckboxGroup extends IButton {
  onChange?: (items: IItem[]) => void;
  items?: ICheckboxItem[];
  labelPath?: string;
  valuePath?: string;
  checkboxProps?: ICheckbox;
  position?: "left" | "right";
  wrapperProps?: IView;
  activeClassName?: string;
  deep?: string;
}

const CheckboxGroup = (props: ICheckboxGroup) => {
  const titleProps = getTitleProps(props);
  const wrapperProps = getWrapperProps(props);

  return (
    <View {...wrapperProps}>
      <Button {...titleProps} />
      <RenderCheckbox {...props} />
    </View>
  );
};

const RenderCheckbox = (props: ICheckboxGroup) => {
  let path = props.deep ? `items.${props.deep}` : "items";
  const items = get(props, path, []);
  if (Array.isArray(items) && items.length > 0) {
    return (
      <>
        {items.map((item, key) => {
          if (Array.isArray(item.items) && item.items.length > 0) {
            const checkboxWithChildProps = getCheckboxWithChildProps(
              props,
              item,
              key
            );
            return <CheckboxGroup key={key} {...checkboxWithChildProps} />;
          } else if (Array.isArray(item.items) && item.items.length === 0) {
            return null;
          } else {
            const checkboxProps = getCheckboxProps(props, item, key);
            return <Checkbox key={key} {...checkboxProps} />;
          }
        })}
      </>
    );
  }
  return null;
};

export default CheckboxGroup;
