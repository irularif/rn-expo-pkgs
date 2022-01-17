import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params: Object = {}) {
  navigationRef.dispatch((state) => {
    const rootstate = navigationRef.getRootState();
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
}

export function replace(name: string, params: Object = {}) {
  navigationRef.dispatch((state) => {
    const rootstate = navigationRef.getRootState();
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
}

export function back() {
  navigationRef.goBack();
}
