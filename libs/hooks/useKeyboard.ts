import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Keyboard } from "react-native";

export interface IKeyboard {
  isVisible: boolean;
  height: number;
}

const useKeyboard = (): IKeyboard => {
  const [visible, setvisible] = useState(false);
  const [height, setheight] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
        setvisible(true);
        setheight(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", (e) => {
        setvisible(false);
        setheight(e.endCoordinates.height);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [])
  );

  return {
    isVisible: visible,
    height,
  };
};

export default useKeyboard;
