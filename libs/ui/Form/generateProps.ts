import { IFormState, IFormStore } from "../../../types/global";
import { trimObject } from "../../utils/misc";
import validate, {
  formatErrors,
  prepareDataForValidation,
  yupToFormErrors,
} from "../../utils/validation";
import { cloneDeep, debounce, get, set } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { IForm } from ".";
import { IView } from "../View";

const INITIAL_FORM_STATE: IFormState = {
  init: false,
  initialData: {},
  data: {},
  scheme: {},
  fields: [],
};

const onChange = debounce((props, meta) => {
  if (props.onChange) {
    props.onChange(cloneDeep(meta.data));
  }
}, 500);

const onValidate = debounce(async (field, meta, setMeta) => {
  let nmeta = cloneDeep(meta);
  let fields = await validateForm(nmeta, field);
  nmeta.fields = fields;
  setMeta(nmeta);
}, 500);

const validateForm = async (state: any, field: string = "") => {
  let { data, errors, scheme, fields } = cloneDeep(state);
  if (!!scheme) {
    try {
      const validateData = prepareDataForValidation(data);
      await validate
        .object()
        .shape(scheme)
        .validate(validateData, {
          abortEarly: false,
        })
        .then((_: any) => {
          if (!!field) {
            let idx = fields.findIndex((x: any) => x.path === field);
            if (idx > -1) {
              fields[idx].error = "";
            }
          } else {
            fields = fields.map((x: any) => ({
              ...x,
              error: "",
            }));
          }
        })
        .catch((e: any) => {
          if (e.name === "ValidationError") {
            let err: any = yupToFormErrors(e);
            err = formatErrors(err, fields);
            if (!!err && !!field) {
              let idx = fields.findIndex((x: any) => x.path === field);
              fields[idx].error = err[field];
            } else {
              fields = fields.map((x: any) => ({
                ...x,
                error: get(err, x.path, ""),
              }));
            }
          } else {
            // We throw any other errors
            console.warn(
              "Warning: An unhandled error was caught during validation in <Form validationSchema />",
              errors
            );
          }
        });
    } catch (error) {
      console.warn(error);
    }
  }

  return fields;
};

const initForm = (props: IForm): IFormStore => {
  const initialData = cloneDeep(props.initialData);
  const data = cloneDeep(get(props, "data", {}));
  const scheme = cloneDeep(props.validationScheme);
  const formState = useState(INITIAL_FORM_STATE);
  const [meta, setMeta] = formState;
  const refs = useRef();

  const initForm = () => {
    setMeta({
      ...INITIAL_FORM_STATE,
      data,
      initialData,
      scheme,
      init: true,
    });
  };

  const updateData = () => {
    let nmeta = cloneDeep(meta);
    setMeta({
      ...nmeta,
      data: get(props, "data", {}),
    });
  };

  const resetForm = () => {
    setMeta(INITIAL_FORM_STATE);
  };

  const onFieldChange = async (path: string, value: string) => {
    let nmeta = cloneDeep(meta);
    set(nmeta.data, path, value);
    setMeta(nmeta);

    const validationMode = get(props, "validationMode", "ontyping");
    if (validationMode === "ontyping") {
      await onValidate(path, nmeta, setMeta);
    }

    if (props.onFieldChange) {
      let ndata = await props.onFieldChange(path, value, nmeta.data);
      if (!!ndata) {
        nmeta.data = ndata;
      }
    }

    onChange(props, nmeta);
  };

  const onSubmitForm = async () => {
    let nmeta = cloneDeep(meta);
    let fields = await validateForm(nmeta);

    let iserror = fields.filter((x: any) => !!x.error).length > 0;
    if (!iserror && props.onSubmit) {
      props.onSubmit(nmeta.data);
    }

    if (!!iserror && props.onError) {
      props.onError(fields.filter((x: any) => !!x.error));
    }

    nmeta.fields = fields;
    setMeta(nmeta);
  };

  const onResetForm = () => {
    const nmeta = cloneDeep(meta);
    nmeta.data = nmeta.initialData;

    if (props.onChange) {
      props.onChange(nmeta.initialData);
    }
  };

  const onFieldBlur = async (path: string) => {
    const validationMode = get(props, "validationMode", "ontyping");

    if (validationMode === "onblur") {
      let nmeta = cloneDeep(meta);
      let fields = await validateForm(nmeta, path);
      nmeta.fields = fields;
      setMeta(nmeta);
    }
  };

  useEffect(() => {
    if (meta.init) {
      updateData();
    }
  }, [props.data]);

  useEffect(() => {
    initForm();

    return () => {
      resetForm();
    };
  }, []);

  return {
    form: meta,
    refs,
    setform: setMeta,
    onFieldChange,
    onSubmitForm,
    onResetForm,
    onFieldBlur,
  };
};

const getFormikProps = (props: IForm) => {
  const cprops: IView = trimObject(props, [
    "data",
    "validationScheme",
    "onSubmit",
    "onChange",
    "onFieldChange",
    "onError",
  ]);
  const className = `flex flex-col ${get(props, "className", "")}`;

  return {
    ...cprops,
    className,
    ref: props.componentRef,
  };
};

export { initForm };

export default getFormikProps;
