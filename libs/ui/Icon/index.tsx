import * as IconSource from "@expo/vector-icons";
import { IComponent } from "../../../types/global";
import React from "react";
import { SvgProps } from "react-native-svg";
import View from "../View";
import getIconProps, { getSVGProps, getWrapperProps } from "./generateProps";

export interface IIcon extends IComponent, Omit<SvgProps, "children"> {
  source?:
    | "AntDesign"
    | "Entypo"
    | "EvilIcons"
    | "Feather"
    | "Fontisto"
    | "FontAwesome"
    | "FontAwesome5"
    | "Foundation"
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "MaterialIcons"
    | "Octicons"
    | "SimpleLineIcons"
    | "Zocial";
  name: string | React.FC<SvgProps>;
  size?: number;
  color?: string;
}

const Icon = (props: IIcon) => {
  const wrapperProps = getWrapperProps(props);

  return (
    <View {...wrapperProps}>
      <RenderIcon {...props} />
    </View>
  );
};

const RenderIcon = (props: IIcon) => {
  if (typeof props.name === "function") {
    const SVGIcon = props.name;
    const SVGProps = getSVGProps(props);

    return <SVGIcon {...SVGProps} />;
  }
  const iconProps = getIconProps(props);
  const VIcon: any = (IconSource as any)[iconProps.source || "Ionicons"];

  return <VIcon {...iconProps} />;
};

export default Icon;
