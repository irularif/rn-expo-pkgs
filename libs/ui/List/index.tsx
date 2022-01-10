import { IComponent } from "../../../types/global";
import React from "react";
import { FlatList, FlatListProps } from "react-native";
import getListProps from "./generateProps";

export interface IList extends IComponent, FlatListProps<any> {
  children?: undefined;
}

const List = (props: IList) => {
  const listProps = getListProps(props);

  return <FlatList {...listProps} />;
};

export default List;
