import { NavigationContainerProps } from "@react-navigation/core";
import { NativeStackNavigatorProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import LibsState, { LibsContext } from "pkgs/system/store";
import React, { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { FontSources } from "../../../system/autoload/fonts";
import { IConfigStore, TRole } from "../../../types/global";
import View from "../View";
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
}

// const store = configureStore(MiddlewareArgs);

const AppProvider = (props: IAppProvider) => {
  const [isReady, setIsReady] = useState(false);

  const prepare = async () => {
    try {
      // Keep the splash screen visible while we fetch resources
      await SplashScreen.preventAutoHideAsync();
      // Pre-load fonts, make any API calls you need to do here
      await Font.loadAsync(FontSources);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsReady(true);
    }
  };

  const onLayoutRootView = useCallback(() => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    prepare();
  }, []);

  return (
    // @ts-ignore
    <Provider store={LibsState} context={LibsContext}>
      <SafeAreaProvider>
        <View onLayout={onLayoutRootView} className="flex flex-1">
          {!!isReady ? (
            <NavigationProvider {...props} />
          ) : (
            <AppProviderLoading {...props} />
          )}
        </View>
      </SafeAreaProvider>
    </Provider>
  );
};

export default AppProvider;
