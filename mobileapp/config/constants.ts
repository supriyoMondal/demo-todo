import { Platform } from "react-native";

export const BASE_URL = `http://${
  Platform.OS === "ios" ? "localhost" : "10.0.2.2"
}:3000/api`;
export const licenseKey = "la286d8bfcb014da1aa403846d791e32e";
