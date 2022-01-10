import tailwind, { parseStyleToObject } from "../../utils/styles";
import { get } from "lodash";
import { IImage } from ".";

const getImageProps = (props: IImage) => {
  const style = generateStyle(props);

  return {
    ...props,
    style,
    ref: props.componentRef,
  };
};

const generateStyle = (props: IImage) => {
  const style: any = {};
  const className = `w-40 h-40 bg-red-100 ${get(props, "className", "")}`;

  Object.assign(style, tailwind(className), parseStyleToObject(props.style));

  return style;
};

export default getImageProps;
