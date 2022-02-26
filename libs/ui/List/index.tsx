import { IComponent } from "../../../types/global";
import React from "react";
import { FlatList, FlatListProps, Animated } from "react-native";
import getListProps from "./generateProps";

const AnimatedFlatList = Animated.FlatList;

export interface IList extends IComponent, FlatListProps<any> {
  children?: undefined;
  rootClassName?: string;
  type?: "animated" | "default";
}

const List = (props: IList) => {
  const listProps = getListProps(props);
  let Component: any = FlatList;
  if (props.type === "animated") {
    Component = AnimatedFlatList;
  }

  return <Component {...listProps} />;
};

export default List;
