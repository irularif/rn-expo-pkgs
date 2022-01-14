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
import TextInput, { ITextInput } from "../TextInput";
import View, { IView } from "../View";
import getButtonProps, {
  getBackdropProps,
  getDropdownWrapperProps,
  getFilterProps,
  getItemProps,
  getListProps,
  init,
} from "./generateProps";

export interface IList extends Omit<IOriList, "renderItem"> {
  renderItem?: (item: ListRenderItemInfo<any>, selectedItem: any) => ReactNode;
}

export interface ISelectItem extends IBasicItem, Partial<IButton> {}
export interface IFilterProps extends ITextInput {
  onFilter?: (filter: string) => void;
}

export interface ISelect extends Omit<IButton, "suffix"> {
  value?: any;
  onChange?: (value: any, item: any) => void;
  items?: ISelectItem[];
  labelPath?: string;
  valuePath?: string;
  backdropProps?: TouchableOpacityProps;
  wrapperProps?: IView;
  listProps?: Partial<IList>;
  itemProps?: IButton;
  enableFilter?: boolean;
  filterProps?: IFilterProps;
  editable?: boolean;
  placeholder?: string;
  suffix?: Partial<IIcon | JSX.Element | undefined>;
}

const Select = (props: ISelect) => {
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
  const buttonProps = getButtonProps(
    props,
    itemsState,
    dropdownOpenState,
    buttonRef,
    btnPosState
  );

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
          <RenderFilter
            selectProps={props.selectProps}
            filterState={props.filterState}
            buttonRef={props.buttonRef}
            btnPosState={props.btnPosState}
          />
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

const RenderFilter = (props: any) => {
  const filterProps = getFilterProps(
    props.selectProps,
    props.filterState,
    props.btnPosState,
    props.buttonRef
  );

  if (props.selectProps.enableFilter) {
    return <TextInput {...filterProps} />;
  }

  return null;
};

export default Select;
