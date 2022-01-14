import {
  createSlice,
  CreateSliceOptions,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { RootStore } from "../../../types/global";

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
  const nstate = {
    isLoading: false,
    page: 0,
    total_record: 0,
    items: [],
  };
  Object.assign(nstate, initialState);

  let reducers: ValidateSliceCaseReducers<State, CaseReducers> = {
    init(state, action) {
      return nstate;
    },
    loading(state: any, action) {
      state.isLoading = action.payload;
    },
    ...options.reducers,
  };

  Object.assign(options, {
    initialState: nstate,
    reducers,
  });

  const slice = createSlice(options);

  Object.assign(slice, {
    _isStore: true,
  });

  return slice;
}
