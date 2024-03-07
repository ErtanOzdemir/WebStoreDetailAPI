import { WebStoreDetailAPIFactory } from "../../src";
import {
  WebStoreDetailAPI,
  ExtensionDetail,
} from "../../src/types/WebStoreDetailAPI";

import { describe, expect, beforeEach, it } from "@jest/globals";

describe("ChromeDetailAPI", () => {
  let chromeDetailAPI: WebStoreDetailAPI;

  beforeEach(() => {
    chromeDetailAPI = WebStoreDetailAPIFactory.createDetailAPI({
      platform: "chrome",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
  });

  it("should return correct types", async () => {
    const detail: ExtensionDetail = await chromeDetailAPI.getDetail(
      "gmbmikajjgmnabiglmofipeabaddhgne"
    );

    expect(typeof detail.title).toBe("string");
    expect(typeof detail.userCount).toBe("string");
    expect(typeof detail.rating).toBe("number");
    expect(typeof detail.rateCount).toBe("string");
    expect(detail.updated).toBeInstanceOf(Date);
    expect(typeof detail.description).toBe("string");
    expect(typeof detail.version).toBe("string");
    expect(Array.isArray(detail.screenshots)).toBe(true);

    detail.screenshots.forEach((screenshot: string) => {
      expect(typeof screenshot).toBe("string");
    });

    expect(detail.filesize).toEqual({
      size: expect.any(Number),
      unit: expect.any(String),
    });

    expect(detail.socials.homepage).toEqual(expect.any(String));
    expect(detail.socials.support).toBeNull();
    expect(detail.socials.email).toEqual(expect.any(String));
  });

  it("should return correct details", async () => {
    const detail: ExtensionDetail = await chromeDetailAPI.getDetail(
      "gmbmikajjgmnabiglmofipeabaddhgne"
    );

    expect(detail.title).toBe("Save to Google Drive");
    expect(typeof Number(detail.userCount?.split(",")[0])).toBe("number");
    expect(detail.rating).toBeLessThanOrEqual(5);
    expect(detail.rating).toBeGreaterThanOrEqual(1);
    expect(typeof Number(detail.rateCount?.split(",")[0])).toBe("number");
    expect(detail.updated).toBeInstanceOf(Date);
    expect(typeof detail.description).toBe("string");
    expect(typeof detail.version).toBe("string");
    expect(Array.isArray(detail.screenshots)).toBe(true);

    detail.screenshots.forEach((screenshot: string) => {
      expect(typeof screenshot).toBe("string");
    });

    expect(detail.filesize).toEqual({
      size: expect.any(Number),
      unit: expect.stringMatching(/^(MiB|KiB|B|TiB|GiB|PiB|EiB|ZiB|YiB)$/),
    });

    expect(detail.socials.homepage).toEqual("https://drive.google.com");
    expect(detail.socials.support).toBeNull();
    expect(detail.socials.email).toEqual("drive-extension-support@google.com");
  });

  it("should throw error when extension not found", async () => {
    await expect(
      chromeDetailAPI.getDetail("nonexistent-extension-id")
    ).rejects.toThrow("Extension not found.");
  });

  it("should throw error when extension id is not provided", async () => {
    await expect(chromeDetailAPI.getDetail("")).rejects.toThrow(
      "Extension id is required"
    );
  });
});
