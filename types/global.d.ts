import { ParamListBase, RouteProp } from "@react-navigation/core";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { CameraType, FlashMode } from "expo-camera/build/Camera.types";
import { IAlertComponent } from "libs/ui/Alert";
import { rootStore } from "pkgs/libs/ui/AppProvider";
import { ReactNode } from "react";
import {
  ColorSchemeName,
  StyleProp,
  TextStyle,
  ViewProps,
  ViewStyle,
} from "react-native";
import { RootStore, TRole as typeRole } from "root/types/global";

export type TRole = "guest" | typeRole;

export interface IPage {
  (): JSX.Element;
  router?: {
    name?: string;
    children?: (props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => React.ReactNode;
    getComponent?: () => React.ComponentType<any>;
    initialParams?: {
      [x: string]: any;
    };
    options?: NativeStackNavigationOptions;
    role?: TRole[];
  };
}

export interface IPages {
  [k: string]: IPage;
}

export interface IComponent extends ViewProps {
  className?: string;
  componentRef?: React.LegacyRef<any>;
  children?: any;
  ref?: any;
}

export interface ITheme {
  primaryColor?: string;
  secondaryColor?: string;
  fontStyle?: string;

  statusBarBgColor?: string;

  pageStyle?: string | StyleProp<ViewStyle>;
  textStyle?: string | StyleProp<TextStyle>;
  buttonStyle?: string | StyleProp<ViewStyle>;
  inputStyle?: string | StyleProp<TextStyle>;
  inputWrapperStyle?: string | StyleProp<TextStyle>;
  fieldStyle?: string | StyleProp<TextStyle>;
  placeholderStyle?: string | StyleProp<TextStyle>;
  labelStyle?: string | StyleProp<TextStyle>;
}

export interface IFonts {
  [k: string]: number;
}

export interface IItem {
  [key: string]: any;
}

export interface PortalType {
  portalId: string;
  node: ReactNode;
}

export interface IConfigCamera {
  type: CameraType;
  flashMode: FlashMode;
  ratio: "1:1" | "4:3" | "16:9";
}

export interface IConfigStatusBar {
  translucent?: boolean;
  statusBarBgColor?: string;
  statusBarStyle?: "dark-content" | "light-content";
}

export interface IConfigStore {
  camera: IConfigCamera;
  statusBar: IConfigStatusBar;
  theme: ColorSchemeName;
}

export interface IConfigStore {
  camera: IConfigCamera;
  statusBar: IConfigStatusBar;
  theme: ColorSchemeName;
}

export interface IFieldState {
  path: string;
  label: string;
  error?: string;
  inputRef?: any;
}

export interface IFormState {
  init: boolean;
  initialData: IItem;
  data: IItem;
  scheme: IItem;
  fields: IFieldState[];
}

export interface IFormStore {
  form: IFormState;
  refs?: any;
  setform: React.Dispatch<React.SetStateAction<IFormState>>;
  onFieldChange: (path: string, value: string) => void;
  onSubmitForm: () => void;
  onResetForm: () => void;
  onFieldBlur: (field: string) => void;
}

export interface IAlert {
  title: string;
  message?: string;
  onOK?: () => void;
  onCancel?: () => void;
  customize?: Omit<IAlertComponent, "title" | "message">;
}

export interface IAlertStore extends IAlert {
  init: boolean;
  visible: boolean;
  mode: "alert" | "prompt";
}
