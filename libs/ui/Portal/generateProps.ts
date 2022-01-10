import { usePortal } from "../../hooks/";
import uuid from "../../utils/uuid";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { IPortal } from ".";

const initPortal = (props: IPortal) => {
  const hostName = props.hostName || "root";
  //#region hooks
  const { addUpdatePortal, removePortal } = usePortal(hostName);
  //#endregion

  //#region variables
  const name = useMemo(() => props.portalId || uuid.v4(), [props.portalId]);

  const onMountRef = useRef<Function>();
  const onUnmountRef = useRef<Function>();
  const onUpdateRef = useRef<Function>();

  //#region callbacks
  const handleOnMount = useCallback(() => {
    if (props.onMount) {
      props.onMount(() => addUpdatePortal(name, props.children));
    } else {
      addUpdatePortal(name, props.children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onMount, addUpdatePortal]);
  onMountRef.current = handleOnMount;

  const handleOnUnmount = useCallback(() => {
    if (props.onUnmount) {
      props.onUnmount(() => removePortal(name));
    } else {
      removePortal(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onUnmount, removePortal]);
  onUnmountRef.current = handleOnUnmount;

  const handleOnUpdate = useCallback(() => {
    if (props.onUpdate) {
      props.onUpdate(() => addUpdatePortal(name, props.children));
    } else {
      addUpdatePortal(name, props.children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onUpdate, addUpdatePortal, props.children]);
  onUpdateRef.current = handleOnUpdate;
  //#endregion

  //#region effects
  useEffect(() => {
    onMountRef.current?.();

    return () => {
      onUnmountRef.current?.();

      // remove callbacks refs
      onMountRef.current = undefined;
      onUnmountRef.current = undefined;
      onUpdateRef.current = undefined;
    };
  }, []);
  useEffect(() => {
    onUpdateRef.current?.();
  }, [props.children]);
};

export default initPortal;
