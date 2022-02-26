import * as ImageManipulator from "expo-image-manipulator";
import { Image } from "react-native";
import Alert from "./alert";

export interface IImageResizer {
  uri: string;
  actions?: ImageManipulator.Action[];
  options?: ImageManipulator.SaveOptions;
}

export default (props: IImageResizer): Promise<string | null> => {
  const { uri, actions, options } = props;
  return new Promise(async (resolve, reject) => {
    try {
      const success = async (w: number, h: number) => {
        let width = w;
        let height = h;
        if (w > h && w > 1080) {
          width = 1080;
          height = width / (w / h);
        } else if (h > w && h > 1080) {
          height = 1080;
          width = height * (w / h);
        }
        await ImageManipulator.manipulateAsync(
          uri,
          ([{ resize: { width, height } }] as any).concat(
            actions || [{ resize: { width, height } }]
          ),
          Object.assign(
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
            options
          )
        )
          .then((resizedPhoto: any) => {
            resolve(resizedPhoto.uri);
          })
          .catch((error: any) => {
            let msg = error.message;
            if (!msg) {
              msg = "Failed to compress image. Please try again.";
            }
            Alert.toast({
              duration: 3000,
              message: msg,
            });
            reject(uri);
          });
      };
      Image.getSize(uri, success, (e) => {
        resolve(uri);
      });
    } catch (error: any) {
      let msg = error?.message;
      if (!msg) {
        msg = "Failed to compress image. Please try again.";
      }
      Alert.toast({
        duration: 3000,
        message: msg,
      });
      reject(uri);
    }
  });
};
