import { IFormStore } from "../../types/global";
import { createContext } from "react";

export const FormContext = createContext<IFormStore | null>(null);
