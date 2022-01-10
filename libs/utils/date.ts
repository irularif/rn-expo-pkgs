import { format as formatFNS, parseISO } from "date-fns";
import * as locales from "date-fns/locale";

export const dateParse = (value: any) => {
  if (typeof value === "string") {
    return parseISO(value);
  }
  return value;
};
export const dateFormat = (
  value: any,
  format?: string,
  locale: string = "id"
) => {
  const inputFormat = format ? format : "dd MMM yyyy - HH:mm";
  try {
    if (typeof value === "string") {
      return formatFNS(parseISO(value), inputFormat, {
        locale: (locales as any)[locale],
      });
    } else {
      return formatFNS(value, inputFormat, {
        locale: (locales as any)[locale],
      });
    }
  } catch (e) {
    return "";
  }
};
