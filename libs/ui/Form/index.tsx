import { FormContext } from "../../../system/context/form";
import { IComponent, IFieldState } from "../../../types/global";
import React, { memo } from "react";
import View from "../View";
import getFormikProps, { initForm } from "./generateProps";

export interface IErrors {
  [k: string]: string;
}

export interface ILabels {
  [k: string]: string;
}

export interface IData {
  [k: string]: string | number | any | IData;
}

export interface IForm extends IComponent {
  initialData: IData;
  data?: IData;
  validationScheme?: any;
  onSubmit?: (data: IData) => void;
  onChange?: (data: any) => void;
  onFieldChange?: (
    path: string,
    value: any,
    data: IData
  ) => void | IData | Promise<void | IData>;
  onError?: (fields: IFieldState[]) => void;
  validationMode?: "ontyping" | "onblur";
}

const FormComponent = (props: IForm) => {
  const formState = initForm(props);

  return (
    <FormContext.Provider value={formState}>
      <RenderForm {...props} />
    </FormContext.Provider>
  );
};

const RenderForm = (props: IForm) => {
  const formikProps = getFormikProps(props);

  return <View {...formikProps} />;
};

const Form = memo(FormComponent);
Form.displayName = "FormProvider";

export default FormComponent;
