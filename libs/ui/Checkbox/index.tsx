import React from 'react';
import Button, {IButton} from '../Button';
import getCheckboxProps from './generateProps';

export interface ICheckbox extends IButton {
  value?: boolean;
  onChange?: (value: boolean) => void;
  position?: 'left' | 'right';
  activeClassName?: string;
}

const Checkbox = (props: ICheckbox) => {
  const buttonProps = getCheckboxProps(props);

  return <Button {...buttonProps} />;
};

export default Checkbox;
