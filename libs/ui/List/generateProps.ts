import tailwind, { parseStyleToObject } from "../../utils/styles";
import waitUntil from "../../utils/waitUntil";
import { get, set } from "lodash";
import { useRef } from "react";
import { FlatList, FlatListProps } from "react-native";
import { IList } from ".";

const getListProps = (props: IList) => {
  const cprops: IList = { ...props };
  const style = generateStyle(props);
  const keyExtractor = (_: any, index: number) => String(index);
  const flatListRef = useRef<FlatList>(null);
  const setRef = (ref: any) => {
    set(props, "componentRef.current", ref);
    (flatListRef as any).current = ref;
  };

  const onScrollToIndexFailed = (info: any) => {
    waitUntil(500).then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const containerStyle = generateContainerStyle(props);

  return {
    keyExtractor,
    windowSize: 8,
    initialNumToRender: 12,
    maxToRenderPerBatch: 16,
    keyboardShouldPersistTaps: "handled",
    onScrollToIndexFailed,
    ...cprops,
    style,
    contentContainerStyle: containerStyle,
    ref: setRef,
  } as FlatListProps<any>;
};

const generateStyle = (props: IList) => {
  let style: any = {};
  let className = `flex-1 w-full ${get(props, "rootClassName", "")}`;
  Object.assign(style, tailwind(className), parseStyleToObject(props.style));

  return style;
};

const generateContainerStyle = (props: IList) => {
  let style: any = {};
  let className = `${get(props, "className", "")}`;
  Object.assign(
    style,
    tailwind(className),
    parseStyleToObject(props.contentContainerStyle)
  );

  return style;
};

export default getListProps;
