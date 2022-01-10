import { ReactNode } from "react";
import initPortal from "./generateProps";

export interface IPortal {
  /**
   * Portal's key or name to be used as an identifier.
   * @type string
   * @default nanoid generated unique key.
   */
  portalId?: string;
  /**
   * Host's name to teleport the portal content to.
   * @type string
   * @default 'root'
   */
  hostName?: string;
  /**
   * Override internal mounting functionality, this is useful
   * if you want to trigger any action before mounting the portal content.
   * @type (mount?: () => void) => void
   * @default undefined
   */
  onMount?: (mount: () => void) => void;
  /**
   * Override internal un-mounting functionality, this is useful
   * if you want to trigger any action before un-mounting the portal content.
   * @type (unmount?: () => void) => void
   * @default undefined
   */
  onUnmount?: (unmount: () => void) => void;
  /**
   * Override internal updating functionality, this is useful
   * if you want to trigger any action before updating the portal content.
   * @type (update?: () => void) => void
   * @default undefined
   */
  onUpdate?: (update: () => void) => void;
  /**
   * Portal's content.
   * @type ReactNode
   * @default undefined
   */
  children?: ReactNode | ReactNode[];
  /**
   * Portal's will be mount or not.
   * @type boolean
   * @default undefined
   */
  mount?: boolean;
}

const Portal = (props: IPortal) => {
  initPortal(props);

  return null;
};

export default Portal;
