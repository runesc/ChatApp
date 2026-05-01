import "react-i18next";
import { Resources } from "./i18n";

declare module "react-i18next" {
  interface CustomTypeOptions {
    resources: Resources["en"];
  }
}