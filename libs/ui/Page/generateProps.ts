import { useFocusEffect } from '@react-navigation/native';
import { get } from 'lodash';
import { useLibsSelector } from 'pkgs/libs/hooks/useLibsStore';
import { useCallback } from 'react';
import { Platform, StatusBar, StatusBarProps } from 'react-native';
import { IPage } from '.';
import { Themes } from '../../../system/config';
import { trimObject } from '../../utils/misc';
import { getColor, parseStyleToObject } from '../../utils/styles';

export const getStatusBarProps = (props: IPage): StatusBarProps => {
  const config = useLibsSelector((state) => state.config);
  const cprops = { ...props.statusBarProps };

  const statusBarBgColor = !!Themes.statusBarBgColor
    ? Themes.statusBarBgColor.indexOf('#') === -1
      ? getColor(Themes.statusBarBgColor)
      : Themes.statusBarBgColor
    : '#ffffff00';

  const statusBarStyle =
    cprops.barStyle ||
    (config.theme === 'dark' ? 'light-content' : 'dark-content');

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarStyle);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(statusBarBgColor);
      }
    }, [])
  );

  return {
    translucent: true,
    ...cprops,
    backgroundColor: statusBarBgColor,
    barStyle: statusBarStyle,
  };
};

const getViewProps = (props: IPage) => {
  const cprops = trimObject(props, ['statusBarProps']);
  let className = `flex h-full`;
  let style = {};

  if (typeof Themes.pageStyle === 'string') {
    className = `${className} ${get(Themes, 'pageStyle', '')}`;
  } else if (typeof Themes.pageStyle === 'object') {
    style = parseStyleToObject(Themes.pageStyle);
  }

  className = `${className} ${get(props, 'className', '')}`;
  Object.assign(style, parseStyleToObject(props.style));

  return { ...cprops, className, style };
};

export default getViewProps;
