import * as secureStorageModule from "react-secure-storage";

export type SecureStorageValue =
  | string
  | number
  | boolean
  | Record<string, unknown>;

export type SecureLocalStorageLike = {
  setItem: (key: string, value: SecureStorageValue) => void;
  getItem: (key: string) => unknown;
  removeItem: (key: string) => void;
  clear: () => void;
};

type InteropModule = {
  default?: InteropModule | SecureLocalStorageLike;
};

const mod = secureStorageModule as unknown as InteropModule;

const secureLocalStorage = (
  mod.default &&
  typeof mod.default === "object" &&
  "default" in mod.default
    ? mod.default.default
    : mod.default
) as SecureLocalStorageLike;



export default secureLocalStorage;