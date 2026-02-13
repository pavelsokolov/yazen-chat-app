import { Persistence } from "firebase/auth";

declare module "firebase/auth" {
  export function getReactNativePersistence(
    storage: import("@react-native-async-storage/async-storage").AsyncStorageStatic,
  ): Persistence;
}
