import { TLibsDispatch, LibsContext, TLibsState } from "pkgs/system/store";
import { createDispatchHook, createSelectorHook } from "react-redux";

// @ts-ignore
export const useLibsSelector = createSelectorHook<TLibsState>(LibsContext);
// @ts-ignore
export const useLibsDispatch = createDispatchHook<TLibsDispatch>(LibsContext);
