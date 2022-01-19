// @ts-ignore
import * as store from "app/store/{*.ts,**/*.ts}";
import { MiddlewareArgs } from "app/config/midleware";
import React from "react";
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
  EmptyObject,
  Store,
} from "redux";
import thunkMiddleware from "redux-thunk";

export const getReducer = () => {
  const rootStore = {};

  Object.keys(store).forEach((name) => {
    if (store[name]?._isStore) {
      Object.assign(rootStore, {
        [store[name].name]: store[name].reducer,
      });
    }
  });
  //aasaaa
  return combineReducers(rootStore);
};

export const configureStore = (ExtraArgument: Array<any> = []) => {
  const middlewareEnhancer = applyMiddleware(thunkMiddleware, ...ExtraArgument);
  const rootReducer = getReducer();

  const store = createStore(rootReducer, {}, middlewareEnhancer);

  return store;
};

export const rootStoreRef: React.RefObject<
  Store<EmptyObject, AnyAction> & {
    dispatch: unknown;
  }
> = React.createRef();

export const rootStore = ((rootStoreRef as any).current =
  configureStore(MiddlewareArgs));
