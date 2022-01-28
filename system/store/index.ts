import { createContext } from "react";
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
  EmptyObject,
  Store,
} from "redux";
import thunkMiddleware from "redux-thunk";
import ToastState from "./toast";

export const configureStore = () => {
  const middlewareEnhancer = applyMiddleware(thunkMiddleware);
  const rootReducer = combineReducers({
    toast: ToastState.reducer,
  });

  const store = createStore(rootReducer, {}, middlewareEnhancer);

  return store;
};

const LibsState = configureStore();
export const LibsContext = createContext<TLibsState | null>(null);
LibsContext.displayName = "LibsContext";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type TLibsState = ReturnType<typeof LibsState.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof LibsState.dispatch;

export default LibsState;
