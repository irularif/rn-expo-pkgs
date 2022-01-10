import {
  createSlice,
  CreateSliceOptions,
  Slice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { RootStore } from "../../../types/global";
import { getActions } from "../../system/autoload/store";

export type IRootStateActions = {
  [Property in keyof RootStore]?: {
    init: () => void;
    loading: (payload: boolean) => void;
  };
};

export function createStore<
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string = string
>(options: CreateSliceOptions<State, CaseReducers, Name>) {
  let { initialState } = options;
  let reducers: ValidateSliceCaseReducers<State, CaseReducers> = {
    init(state, action) {
      return initialState;
    },
    loading(state: any, action) {
      state.isLoading = action.payload;
    },
    ...options.reducers,
  };
  const state = {
    isLoading: false,
    page: 0,
    total_record: 0,
    items: [],
  };
  Object.assign(state, initialState);

  Object.assign(options, {
    initialState: state,
    reducers,
  });

  const slice = createSlice(options);

  Object.assign(slice, {
    _isStore: true,
  });

  return slice;
}
