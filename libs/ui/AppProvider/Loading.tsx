import React from "react";
import { IAppProvider } from ".";
import View from "../View";

const AppProviderLoading = (props: IAppProvider) => {
  const SplashScreen = props.RenderSplash;

  if (!!SplashScreen) {
    return (
      <View className="bg-white dark:bg-bray-800 flex flex-1">
        <SplashScreen />
      </View>
    );
  }

  return null;
};

export default AppProviderLoading;
