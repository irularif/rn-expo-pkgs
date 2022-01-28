import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "../../utils/navigation";
import generatePages from "../../../system/autoload/pages";
import React, { useEffect, useState } from "react";
import { TRole } from "root/types/global";
import { IAppProvider } from ".";
import Alert from "../Alert";
import PortalProvider from "../Portal/PortalProvider";
import AppProviderLoading from "./Loading";
import Toast from "../Toast";

const Stack = createNativeStackNavigator();

const NavigationProvider = (props: IAppProvider) => {
  const [routes, setRoutes] = useState([]);

  const getRoute = () => {
    let AppRoutes = generatePages();
    const checkRole = (role: TRole[]) => {
      let canAccess = false;
      if (!props.role || role.length === 0) {
        canAccess = true;
      } else if (Array.isArray(props.role) && props.role.length > 0) {
        for (let r of props.role) {
          if (role.indexOf(r) > -1) {
            canAccess = true;
            break;
          }
        }
      } else if (
        typeof props.role === "string" &&
        role.indexOf(props.role) > -1
      ) {
        canAccess = true;
      } else if (
        ((Array.isArray(props.role) && props.role.length === 0) ||
          !props.role) &&
        role.indexOf("guest") > -1
      ) {
        canAccess = true;
      }
      return canAccess;
    };
    AppRoutes = AppRoutes.filter((screen: any) => {
      const role = screen.role;
      if (!role || (Array.isArray(role) && checkRole(role))) {
        return true;
      }
      return false;
    });
    if (JSON.stringify(AppRoutes) !== JSON.stringify(routes)) {
      setRoutes(AppRoutes);
    }
  };

  useEffect(() => {
    getRoute();
  }, [props.role]);

  if (routes.length) {
    return (
      <NavigationContainer {...props.navigationProps} ref={navigationRef}>
        <PortalProvider>
          <Alert>
            <Stack.Navigator
              {...props.stackNavigatorProps}
              screenOptions={{
                headerTransparent: true,
                presentation: "card",
                headerShown: false,
                ...props.stackNavigatorProps?.screenOptions,
              }}
              defaultScreenOptions={{
                headerTransparent: true,
              }}
            >
              {routes.map((screen: any, key: number) => (
                <Stack.Screen key={key} {...screen} />
              ))}
            </Stack.Navigator>
          </Alert>
          <Toast />
        </PortalProvider>
      </NavigationContainer>
    );
  }

  return <AppProviderLoading {...props} />;
};

export default NavigationProvider;
