import { get, set } from "lodash";
import { Themes } from "pkgs/system/config";
import { useContext, useEffect } from "react";
import { IField } from ".";
import { FormContext } from "../../../system/context/form";
import { IFormStore } from "../../../types/global";
import { trimObject } from "../../utils/misc";

const getFieldProps = (props: IField) => {
  const { form: state }: IFormStore = useContext(FormContext) || ({} as any);
  const cprops = trimObject(props, ["onChange"]);
  const className = `flex flex-col mb-4 ${get(props, "className", "")}`;

  const init = () => {
    if (state?.init) {
      let idx = state.fields.findIndex((x) => x.path === props.path);
      if (idx === -1) {
        state.fields.push({
          path: props.path,
          label: props.label,
          error: "",
        });
      } else {
        state.fields[idx].label = props.label;
      }
    }
  };

  useEffect(() => {
    init();
  }, [state?.init]);

  return {
    ...cprops,
    className,
    ref: props.componentRef,
  };
};

const getInputProps = (props: IField) => {
  const { form, refs, onFieldChange, onFieldBlur }: IFormStore =
    useContext(FormContext) || ({} as any);
  const cprops = trimObject(get(props, "inputProps", {}), []);
  const path = get(props, "path", "");
  const value = get(form, `data.${path}`, "");
  const field = form.fields.find((x) => x.path === props.path);
  set(cprops, "isError", !!field?.error);

  const setRef = (ref: any) => {
    const oRef = get(props, "inputProps.componentRef", ref);
    if (typeof oRef === "function") {
      oRef(ref);
    } else if (!!oRef) {
      set(props, "inputProps.componentRef", ref);
    }
    if (!refs.current) {
      refs.current = {};
    }
    if (
      !!props.type &&
      ["select", "camera", "checkbox", "date", "datetime", "time"].indexOf(
        props.type
      ) === -1
    ) {
      refs.current[props.path] = ref;
    }
  };

  const getValue = (e: any) => {
    switch (props.type) {
      case "camera":
      case "checkbox":
      case "select":
      case "date":
      case "datetime":
      case "time":
        return e;
      default:
        return get(e, "nativeEvent.text", "");
    }
  };

  const onBlur = (e: any) => {
    onFieldBlur(props.path);

    if (props.inputProps?.onBlur) {
      props.inputProps?.onBlur(e);
    }
  };
  const onChange = (e: any, item: any) => {
    let value = getValue(e);
    onFieldChange(path, value);
    if (props.inputProps?.onChange) {
      props.inputProps?.onChange(e as never, item);
    }
    if (props.onChange) {
      props.onChange(value);
    }
  };

  let className = `${get(props, "inputProps.className", "")}`;
  if (props.readonly) {
    className = `${className}`;
  }

  const onSubmitEditing = (e: any) => {
    let value = getValue(e);
    onFieldChange(path, value);
    // @ts-ignore
    if (props.inputProps?.onSubmitEditing) {
      // @ts-ignore
      props.inputProps.onSubmitEditing(e);
    }
    let idx = form.fields.findIndex((x) => x.path === props.path);
    if (idx > -1) {
      if (!!refs.current[form.fields[idx + 1]?.path]) {
        if (!!refs.current[form.fields[idx + 1].path]?.isFocused) {
          refs.current[form.fields[idx + 1].path].focus?.();
        }
      }
    }
  };

  return {
    ...cprops,
    componentRef: setRef,
    className,
    editable: !props.readonly,
    value,
    onBlur,
    onChange,
    onSubmitEditing,
  };
};

const getLabelProps = (props: IField) => {
  const cprops = { ...props.labelProps };
  const style = {};
  let className = ``;
  if (typeof Themes.fieldStyle === "string") {
    className = `${className} ${Themes.fieldStyle}`;
  } else {
    Object.assign(style, Themes.fieldStyle);
  }
  className = `${className} ${get(props, "labelProps.className", "")}`;

  return {
    ...cprops,
    className,
    style,
    ref: cprops.componentRef,
  };
};

const getCaptionProps = (props: IField) => {
  const cprops = { ...props.captionProps };
  const className = `text-xs px-1 ${get(props, "captionProps.className", "")}`;

  return {
    ...cprops,
    className,
    ref: cprops.componentRef,
  };
};

const getErrorProps = (props: IField) => {
  const { form }: IFormStore = useContext(FormContext) || ({} as any);
  const cprops = { ...props.errorProps };
  const className = `text-xs text-red-600 p-1 ${get(
    props,
    "errorProps.className",
    ""
  )}`;

  if (Array.isArray(form.fields)) {
    const idx = form.fields.findIndex((x) => x.path === props.path);
    set(cprops, "children", get(form, `fields.${idx}.error`, ""));
  }

  return {
    ...cprops,
    className,
    ref: cprops.componentRef,
  };
};

export { getLabelProps, getCaptionProps, getInputProps, getErrorProps };

export default getFieldProps;
