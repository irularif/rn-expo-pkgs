import { Platform } from "react-native";
import mime from "mime-types";

const uriToFile = (path: string) => {
  if (!path) {
    return null;
  }
  const uri = path;
  const uripath = uri.split("/");
  const fileName = uripath[uripath.length - 1];
  const file: any = {
    name: fileName,
    type: mime.lookup(fileName),
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
  };

  return file;
};

export default uriToFile;
