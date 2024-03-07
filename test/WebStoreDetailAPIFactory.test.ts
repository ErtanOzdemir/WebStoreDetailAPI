import { WebStoreDetailAPIFactory } from "../src";

import { describe, expect, it } from "@jest/globals";
import { ChromeDetailAPI, FirefoxDetailAPI, OperaDetailAPI } from "../src";

describe("WebStoreDetailAPIFactory", () => {
  it("should return chrome webstore instance", async () => {
    const createdInstance = WebStoreDetailAPIFactory.createDetailAPI({
      platform: "chrome",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    expect(createdInstance).toBeInstanceOf(ChromeDetailAPI);
  });

  it("should return firefox webstore instance", async () => {
    const createdInstance = WebStoreDetailAPIFactory.createDetailAPI({
      platform: "firefox",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    expect(createdInstance).toBeInstanceOf(FirefoxDetailAPI);
  });

  it("should return opera webstore instance", async () => {
    const createdInstance = WebStoreDetailAPIFactory.createDetailAPI({
      platform: "opera",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    expect(createdInstance).toBeInstanceOf(OperaDetailAPI);
  });
});
