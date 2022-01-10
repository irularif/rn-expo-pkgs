import { get, isPlainObject, set } from "lodash";
import * as yup from "yup";

const validate = yup;

const prepareDataForValidation = (values: any) => {
  let data: any = Array.isArray(values) ? [] : {};

  for (let k in values) {
    if (Object.prototype.hasOwnProperty.call(values, k)) {
      let key = String(k);

      if (Array.isArray(values[key]) === true) {
        data[key] = values[key].map(function (value: any) {
          if (Array.isArray(value) === true || isPlainObject(value)) {
            return prepareDataForValidation(value);
          } else {
            return value !== "" ? value : undefined;
          }
        });
      } else if (isPlainObject(values[key])) {
        data[key] = prepareDataForValidation(values[key]);
      } else {
        data[key] = values[key] !== "" ? values[key] : undefined;
      }
    }
  }

  return data;
};

const yupToFormErrors = (yupError: any) => {
  let errors = {};

  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return set(errors, yupError.path, yupError.message);
    }

    for (
      let _isArray = Array.isArray(yupError.inner),
        _i: any = 0,
        _iterator = _isArray
          ? yupError.inner
          : yupError.inner[Symbol.iterator]();
      ;

    ) {
      let _ref5;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref5 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref5 = _i.value;
      }

      let err = _ref5;

      if (!get(errors, err.path)) {
        errors = set(errors, err.path, err.message);
      }
    }
  }

  return errors;
};

const formatErrors = (errors: any, fields: any[]) => {
  let nerrors: any = {};
  let paths = Object.keys(errors);
  paths.forEach((path) => {
    let field = fields.find((x) => x.path === path);
    nerrors[path] = errors[path].replace(path, field?.label || path);
  });

  return nerrors;
};

export { prepareDataForValidation, yupToFormErrors, formatErrors };

export default validate;
