import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootStore } from "root/types/global";

export const useAppSelector: TypedUseSelectorHook<RootStore> = useSelector;
