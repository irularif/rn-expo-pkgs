import { createContext } from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import ConfigState from "./config";
import ToastState from "./toast";
import thunkMiddleware from "redux-thunk";
import ConfirmationState from "./confirmation";

export const configureStore = () => {
  const middlewareEnhancer = applyMiddleware(thunkMiddleware);
  const rootReducer = combineReducers({
    toast: ToastState.reducer,
    config: ConfigState.reducer,
    confirmation: ConfirmationState.reducer,
  });

  const store = createStore(rootReducer, {}, middlewareEnhancer);

  return store;
};

const LibsState = configureStore();
export const LibsContext = createContext(null);
LibsContext.displayName = "LibsContext";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type TLibsState = ReturnType<typeof LibsState.getState>;
export type TLibsDispatch = typeof LibsState.dispatch;

export default LibsState;
