import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import api from "../../libs/utils/api";
// @ts-ignore
import * as store from "app/store/{*.ts,**/*.ts}";

export const getActions = () => {
  const rootActions = {};

  Object.keys(store).forEach((name) => {
    if (store[name]?._isStore) {
      Object.assign(rootActions, {
        [store[name].name]: store[name].actions,
      });
    }
  });

  return rootActions;
};

export const getReducer = () => {
  const rootStore = {};

  Object.keys(store).forEach((name) => {
    if (store[name]?._isStore) {
      Object.assign(rootStore, {
        [store[name].name]: store[name].reducer,
      });
    }
  });

  return combineReducers(rootStore);
};

export const configureStore = (ExtraArgument: Object) => {
  const thunkWithExtraArgument = thunkMiddleware.withExtraArgument({
    api,
    ...ExtraArgument,
  });
  const middlewareEnhancer = applyMiddleware(thunkWithExtraArgument);
  const rootReducer = getReducer();

  const store = createStore(rootReducer, {}, middlewareEnhancer);

  return store;
};
