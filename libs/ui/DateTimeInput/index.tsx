import React, { useState } from "react";
import Button, { IButton } from "../Button";
import DateTime, { IDateTime } from "../DateTime";
import getButtonProps, { getDateTimeProps } from "./generateProps";

export interface IDateTimeInput extends IButton {
  value: string;
  onChange: (value: string) => void;
  dateTimeProps?: IDateTime;
  formatValue?: string;
  formatLabel?: string;
  mode?: "datetime" | "date" | "time";
}

const DateTimeInput = (props: IDateTimeInput) => {
  const visibleDateState = useState(false);
  const buttonProps = getButtonProps(props, visibleDateState);
  const dateTimeProps = getDateTimeProps(props, visibleDateState);

  return (
    <>
      <Button {...buttonProps} />
      <DateTime {...dateTimeProps} />
    </>
  );
};

export default DateTimeInput;
