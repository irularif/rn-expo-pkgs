import {
  CommonActions,
  NavigationContainerRefContext,
  StackActions,
} from "@react-navigation/native";
import { useCallback, useContext, useMemo } from "react";

const useRootNavigation = () => {
  const root = useContext(NavigationContainerRefContext);

  if (root === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }
  const nav = useMemo(() => root, [root]);

  const navigate = useCallback(
    (name: string, params: Object = {}) => {
      const rootstate = nav.getRootState();
      nav.dispatch((state) => {
        let pageExist = state.routeNames.indexOf(name) > -1;
        if (!pageExist) {
          pageExist = rootstate.routeNames.indexOf(name) > -1;
        }
        if (pageExist) {
          return CommonActions.navigate(name, params);
        } else {
          return CommonActions.navigate("404");
        }
      });
    },
    [nav]
  );

  const replace = useCallback(
    (name: string, params: Object = {}) => {
      const rootstate = nav.getRootState();
      nav.dispatch((state) => {
        let pageExist = state.routeNames.indexOf(name) > -1;
        if (!pageExist) {
          pageExist = rootstate.routeNames.indexOf(name) > -1;
        }
        if (pageExist) {
          return StackActions.replace(name, params);
        } else {
          return CommonActions.navigate("404");
        }
      });
    },
    [nav]
  );

  return {
    ...nav,
    navigate,
    replace,
  };
};

export default useRootNavigation;
