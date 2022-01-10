import { useNavigation } from "@react-navigation/core";
import NotFound from "libs/assets/images/not-found.svg";
import { IPage } from "../../types/global";
import { Page, Text, View } from "libs/ui";
import TopBar from "libs/ui/TopBar";
import React from "react";
import { Dimensions } from "react-native";

const Error404: IPage = () => {
  const nav = useNavigation();
  const { width } = Dimensions.get("window");
  return (
    <Page className="bg-white">
      <TopBar
        backButton={nav.canGoBack()}
        className="shadow-none"
        backButtonProps={{
          className: "text-blue-500",
        }}
      />
      <View className="flex flex-grow items-center justify-center p-10">
        <NotFound width={(3 / 5) * width} height={(3 / 5) * width} />
        <View className="py-6">
          <Text className="font-bold text-lg text-center">
            Oops! Page not Found.
          </Text>
          <Text className="text-gray-500 text-center">
            Seems that the page you are looking for is not exist.
          </Text>
        </View>
      </View>
    </Page>
  );
};

Error404.router = {
  name: "404",
};

export default Error404;
