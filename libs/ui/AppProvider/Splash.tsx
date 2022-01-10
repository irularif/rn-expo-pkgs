import Splash from "../../../assets/images/splash.svg";
import React from "react";
import { Dimensions, View } from "react-native";

const DefaultSplashScreen = () => {
  const { width } = Dimensions.get("window");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Splash width={(3 / 5) * width} height={(3 / 5) * width} />
    </View>
  );
};

export default DefaultSplashScreen;
