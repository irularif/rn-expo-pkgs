import { NavigationContainerProps } from "@react-navigation/core";
import { NativeStackNavigatorProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { MiddlewareArgs } from "app/config/midleware";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { configureStore } from "pkgs/system/autoload/store";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { AnyAction, EmptyObject, Store } from "redux";
import { FontSources } from "../../../system/autoload/fonts";
import { IConfigStore, TRole } from "../../../types/global";
import View from "../View";
import ConfigProvider from "./ConfigProvider";
import AppProviderLoading from "./Loading";
import NavigationProvider from "./NavigationProvider";

export interface IAppProvider {
  role?: TRole | TRole[];
  RenderSplash?: () => JSX.Element;
  navigationProps?: Partial<NavigationContainerProps>;
  stackNavigatorProps?: Partial<NativeStackNavigatorProps>;
  onUpdateInstalled?: () => void | Promise<void>;
  disableAppCenter?: boolean;
  config?: Partial<IConfigStore>;
  store?: Store<EmptyObject, AnyAction> & {
    dispatch: unknown;
  };
}

export const rootStore = configureStore(MiddlewareArgs);

const AppProvider = (props: IAppProvider) => {
  const [appIsReady, setAppIsReady] = useState(false);
  // const [loaded] = useFonts(FontSources);

  const prepare = async () => {
    try {
      // Keep the splash screen visible while we fetch resources
      await SplashScreen.preventAutoHideAsync();
      // Pre-load fonts, make any API calls you need to do here
      await Font.loadAsync(FontSources);
    } catch (e) {
      console.warn(e);
    } finally {
      // Tell the application to render
      setAppIsReady(true);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    prepare();
  }, []);

  return (
    <Provider store={rootStore}>
      <ConfigProvider initialConfig={props.config}>
        <SafeAreaProvider>
          <View onLayout={onLayoutRootView} className="flex flex-1">
            {!!appIsReady ? (
              <NavigationProvider {...props} />
            ) : (
              <AppProviderLoading {...props} />
            )}
          </View>
        </SafeAreaProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default AppProvider;
