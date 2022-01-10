const trimObject = (data: object, prefix: string[]) => {
  let nd: any = { ...data };

  Object.keys(nd).forEach((k) => {
    if (prefix.indexOf(k) > -1) {
      delete nd[k];
    }
  });

  return nd;
};

const isNull = (value: any) => {
  return value === null || value === undefined || value === NaN;
};

const isEmpty = (value: any) => {
  return isNull(value) || value === "";
};

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export { trimObject, isNull, isEmpty, isJsonString };
