import React, { ReactNode } from "react";
import {
  ListRenderItemInfo,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { IItem as IBasicItem } from "../../../types/global";
import Button, { IButton } from "../Button";
import { IIcon } from "../Icon";
import List, { IList as IOriList } from "../List";
import Portal from "../Portal";
import Text from "../Text";
import { ITextInput } from "../TextInput";
import View, { IView } from "../View";
import getButtonProps, {
  getBackdropProps,
  getDropdownWrapperProps,
  getItemProps,
  getListProps,
  init,
} from "./generateProps";

export interface IList extends Omit<IOriList, "renderItem"> {
  renderItem?: (item: ListRenderItemInfo<any>, selectedItem: any) => ReactNode;
}

export interface IDropdownItem extends IBasicItem, Partial<IButton> {}
export interface IFilterProps extends ITextInput {
  onFilter?: (filter: string) => void;
}

export interface IDropdown extends Omit<IButton, "suffix"> {
  items?: IDropdownItem[];
  backdropProps?: TouchableOpacityProps;
  wrapperProps?: IView;
  listProps?: Partial<IList>;
  itemProps?: IButton;
  suffix?: Partial<IIcon | JSX.Element | undefined>;
}

const Select = (props: IDropdown) => {
  const {
    buttonRef,
    wrapperRef,
    itemsState,
    dropdownOpenState,
    btnPosState,
    wrpPosState,
    filterState,
    keyboardHeightState,
    animate,
  } = init(props);
  const buttonProps = getButtonProps(props, dropdownOpenState, buttonRef);

  return (
    <>
      <Button {...buttonProps} />
      <Portal hostName="libs">
        <Dropdown
          selectProps={props}
          wrapperRef={wrapperRef}
          itemsState={itemsState}
          dropdownOpenState={dropdownOpenState}
          btnPosState={btnPosState}
          wrpPosState={wrpPosState}
          filterState={filterState}
          animate={animate}
          buttonRef={buttonRef}
          keyboardHeightState={keyboardHeightState}
        />
      </Portal>
    </>
  );
};

const Dropdown = (props: any) => {
  const [isOpen, _] = props.dropdownOpenState;
  const dropdownWrapperProps = getDropdownWrapperProps(
    props.selectProps,
    props.wrapperRef,
    props.btnPosState,
    props.wrpPosState,
    props.keyboardHeightState,
    props.animate
  );

  const backdropProps = getBackdropProps(
    props.selectProps,
    props.dropdownOpenState,
    props.animate
  );
  const listProps = getListProps(props.selectProps, props.itemsState);
  const renderItem = (item: any) => (
    <RenderItem
      item={item}
      selectProps={props.selectProps}
      dropdownOpenState={props.dropdownOpenState}
      itemsState={props.itemsState}
    />
  );

  if (isOpen) {
    return (
      <>
        <TouchableOpacity {...backdropProps} />
        <View {...dropdownWrapperProps}>
          <List
            ListEmptyComponent={
              <View className="justify-center items-center py-2 flex-grow bg-white shadow-lg rounded">
                <Text className="text-sm">- Data is empty -</Text>
              </View>
            }
            {...listProps}
            renderItem={renderItem}
          />
        </View>
      </>
    );
  }
  return null;
};

const RenderItem = (props: any) => {
  const itemProps = getItemProps(
    props.selectProps,
    props.dropdownOpenState,
    props.item
  );

  return <Button {...itemProps} />;
};

export default Select;
