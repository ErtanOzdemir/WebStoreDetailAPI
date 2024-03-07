import { WebStoreDetailAPIOptions } from "../types";
import { ChromeDetailAPI } from "../api/ChromeDetailAPI";
import { FirefoxDetailAPI } from "../api/FirefoxDetailAPI";
import { OperaDetailAPI } from "../api/OperaDetailAPI";
import { WebStoreDetailAPI } from "../types/WebStoreDetailAPI";

export class WebStoreDetailAPIFactory {
  static createDetailAPI(options: WebStoreDetailAPIOptions): WebStoreDetailAPI {
    switch (options.platform) {
      case "chrome":
        return new ChromeDetailAPI(options);
      case "firefox":
        return new FirefoxDetailAPI(options);
      case "opera":
        return new OperaDetailAPI(options);
      default:
        throw new Error("Unsupported platform");
    }
  }
}
