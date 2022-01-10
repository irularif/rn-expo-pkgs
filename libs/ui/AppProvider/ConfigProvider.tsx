import ConfigContext from "../../../system/context/config";
import ConfigStore, {
  INITIAL_CONFIG_STATE,
} from "../../../system/store/config";
import { IConfigStore } from "../../../types/global";
import React, { memo, useReducer } from "react";

export interface IConfigProvider {
  children: any;
  initialConfig: IConfigStore;
}

const ConfigProviderComponent = (props: any) => {
  const { children, initialConfig } = props;
  Object.assign(INITIAL_CONFIG_STATE, initialConfig);
  const configState = useReducer(ConfigStore, INITIAL_CONFIG_STATE);

  return (
    <ConfigContext.Provider value={configState}>
      {children}
    </ConfigContext.Provider>
  );
};

const ConfigProvider = memo(ConfigProviderComponent);
ConfigProvider.displayName = "ConfigProvider";

export default ConfigProvider;
