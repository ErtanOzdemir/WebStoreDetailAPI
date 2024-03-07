import { WebStoreDetailAPIFactory } from "../../src";
import {
  WebStoreDetailAPI,
  ExtensionDetail,
} from "../../src/types/WebStoreDetailAPI";

import { describe, expect, beforeEach, it } from "@jest/globals";

describe("OperaDetailAPI", () => {
  let operaDetailAPI: WebStoreDetailAPI;

  beforeEach(() => {
    operaDetailAPI = WebStoreDetailAPIFactory.createDetailAPI({
      platform: "opera",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
  });

  it("should return correct types", async () => {
    const detail: ExtensionDetail = await operaDetailAPI.getDetail(
      "magic-actions-for-youtube"
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

    expect(detail.socials.homepage).toEqual(null);
    expect(detail.socials.support).toEqual(expect.any(String));
    expect(detail.socials.email).toBeNull();
  });

  it("should throw error when extension id is not provided", async () => {
    await expect(operaDetailAPI.getDetail("")).rejects.toThrow(
      "Extension id is required"
    );
  });

  it("should throw error when extension id is not found", async () => {
    await expect(
      operaDetailAPI.getDetail("invalid-extension-id")
    ).rejects.toThrow("Extension not found.");
  });

  it("should return correct details", async () => {
    const detail: ExtensionDetail = await operaDetailAPI.getDetail("ublock");

    expect(detail.title).toBe("uBlock Origin");
    expect(typeof Number(detail.userCount?.split(","))).toBe("number");
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
      unit: "MB" || "KB" || "B" || "TB" || "GB" || "PB" || "EB" || "ZB" || "YB",
    });

    expect(detail.socials.homepage).toBeNull();
    expect(detail.socials.support).toEqual(
      "https://github.com/uBlockOrigin/uBlock-issues"
    );
    expect(detail.socials.email).toBeNull();
  });
});
