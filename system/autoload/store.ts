// @ts-ignore
import * as store from "app/store/{*.ts,**/*.ts}";
import { applyMiddleware, combineReducers, createStore } from "redux";
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
  //aasaa
  return combineReducers(rootStore);
};

export const configureStore = (ExtraArgument: Array<any> = []) => {
  const middlewareEnhancer = applyMiddleware(thunkMiddleware, ...ExtraArgument);
  const rootReducer = getReducer();

  const store = createStore(rootReducer, {}, middlewareEnhancer);

  return store;
};
