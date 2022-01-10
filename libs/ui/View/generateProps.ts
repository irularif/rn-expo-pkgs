import { trimObject } from "../../utils/misc";
import tailwind, {
  parseStyleToObject,
  trimStyle,
  trimTextStyle,
} from "../../utils/styles";
import { IView } from ".";

const getViewProps = (props: IView) => {
  const cprops: IView = trimObject(props, ["textProps"]);
  const style = generateStyle(props);

  return {
    ...cprops,
    style,
    ref: props.componentRef,
  };
};

const getTextProps = (props: IView) => {
  const cprops = { ...props.textProps };
  const style = generateTextStyle(props);

  return {
    ...cprops,
    style,
    children: props.children,
    ref: cprops.componentRef,
  };
};

const generateStyle = (props: IView) => {
  let style: any = {};
  Object.assign(
    style,
    tailwind(props.className),
    parseStyleToObject(props.style)
  );
  style = trimTextStyle(style);

  // if (typeof props.children === 'string') {
  //   const ex = ['padding'];
  //   style = trimStyle(style, ex);
  // }

  return style;
};

const generateTextStyle = (props: IView) => {
  let style: any = {};
  Object.assign(style, parseStyleToObject(props.textProps?.style));

  const ex = ["margin", "padding"];
  style = trimStyle(style, ex);

  return style;
};

export { getTextProps };

export default getViewProps;
