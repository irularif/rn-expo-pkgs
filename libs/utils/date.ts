import * as dateFNS from "date-fns";
import * as locales from "date-fns/locale";
const { format: formatFNS, parseISO } = dateFNS;

export const dateParse = (value: string | Date) => {
  if (typeof value === "string") {
    return parseISO(value);
  }
  return value;
};
export const dateFormat = (
  value: string | Date,
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
export const dateRangeFormat = (
  from: string | Date,
  to: string | Date,
  format?: string,
  locale: string = "id"
) => {
  const inputFormat = format ? format : "dd MMMM yyyy";
  try {
    let nfrom = from;
    let nto = to;
    if (typeof nfrom === "string") {
      nfrom = parseISO(nfrom);
    }
    if (typeof nto === "string") {
      nto = parseISO(nto);
    }
    let result = "";
    if (
      dateFNS.isSameDay(nfrom, nto) &&
      dateFNS.isSameMonth(nfrom, nto) &&
      dateFNS.isSameYear(nfrom, nto)
    ) {
      result = dateFormat(nfrom, inputFormat, locale);
    } else if (
      dateFNS.isSameMonth(nfrom, nto) &&
      dateFNS.isSameYear(nfrom, nto)
    ) {
      let date = `${dateFNS.format(nfrom, inputFormat.replace(/[^d]/g, ""), {
        locale: (locales as any)[locale],
      })} - ${dateFNS.format(nto, inputFormat.replace(/[^d]/g, ""), {
        locale: (locales as any)[locale],
      })}`;
      result = dateFNS.format(nto, inputFormat.replace(/d/g, date), {
        locale: (locales as any)[locale],
      });
    } else if (dateFNS.isSameYear(nfrom, nto)) {
      result = `${dateFNS.format(nfrom, inputFormat.replace(/[^dM/\s]/g, ""), {
        locale: (locales as any)[locale],
      })} - ${dateFNS.format(nto, inputFormat.replace(/[y]/g, ""), {
        locale: (locales as any)[locale],
      })}`;
      result += dateFNS.format(nto, inputFormat.replace(/[^y]/g, ""), {
        locale: (locales as any)[locale],
      });
    } else {
      result = `${formatFNS(nfrom, inputFormat, {
        locale: (locales as any)[locale],
      })} - ${formatFNS(nto, inputFormat, {
        locale: (locales as any)[locale],
      })}`;
    }

    return result;
  } catch (e) {
    console.warn(e);
    return "";
  }
};

export default dateFNS;
