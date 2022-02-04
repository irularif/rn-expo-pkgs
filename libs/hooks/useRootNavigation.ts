import {
  CommonActions,
  NavigationContainerRefContext,
  StackActions,
} from "@react-navigation/native";
import { useContext } from "react";

const useRootNavigation = () => {
  const root = useContext(NavigationContainerRefContext);

  if (root === undefined) {
    throw new Error(
      "Couldn't find a navigation object. Is your component inside NavigationContainer?"
    );
  }
  const nav = root;
  const rootstate = nav.getRootState();

  const navigate = (name: string, params: Object = {}) => {
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
  };

  const replace = (name: string, params: Object = {}) => {
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
  };

  return {
    ...nav,
    navigate,
    replace,
  };
};

export default useRootNavigation;
