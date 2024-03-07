import { WebStoreDetailAPIFactory } from "../../src";
import {
  WebStoreDetailAPI,
  ExtensionDetail,
} from "../../src/types/WebStoreDetailAPI";

import { describe, expect, beforeEach, it } from "@jest/globals";

describe("FirefoxDetailAPI", () => {
  let firefoxDetailAPI: WebStoreDetailAPI;

  beforeEach(() => {
    firefoxDetailAPI = WebStoreDetailAPIFactory.createDetailAPI({
      platform: "firefox",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
  });

  it("should return same details when extension identifier used instead of extension ID", async () => {
    const detail1: ExtensionDetail = await firefoxDetailAPI.getDetail(
      "grammarly-1"
    );
    const detail2: ExtensionDetail = await firefoxDetailAPI.getDetail(
      "87677a2c52b84ad3a151a4a72f5bd3c4@jetpack"
    );

    expect(detail1).toEqual(detail2);
  });

  it("should return correct types", async () => {
    const detail: ExtensionDetail = await firefoxDetailAPI.getDetail(
      "google-translator"
    );

    expect(typeof detail.title).toBe("string");
    expect(typeof detail.userCount).toBe("string");
    expect(typeof detail.rating).toBe("number");
    expect(typeof detail.rateCount).toBe("string");
    expect(detail.updated).toBeInstanceOf(Date);
    expect(detail.description).toBeNull();
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
    expect(detail.socials.support).toEqual(expect.any(String));
    expect(detail.socials.email).toBeNull();
  });

  it("should return correct details", async () => {
    const detail: ExtensionDetail = await firefoxDetailAPI.getDetail(
      "languagetool"
    );

    expect(detail.title).toBe(
      "Grammar and Spell Checker - LanguageTool by LanguageTooler GmbH"
    );
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
      unit: "MB" || "KB" || "B" || "TB" || "GB" || "PB" || "EB" || "ZB" || "YB",
    });

    expect(detail.socials.homepage).toEqual(
      "https://prod.outgoing.prod.webservices.mozgcp.net/v1/2784e8753205334dfb8b51e670a33f6c9d5820821f44f3d062f81eb2fd45f5ef/https%3A//languagetool.org"
    );
    expect(detail.socials.support).toEqual(
      "https://prod.outgoing.prod.webservices.mozgcp.net/v1/7cd2e2000a2455cafbe858770245772bd1ffed5f088d077e8933253eb3031afc/https%3A//forum.languagetool.org"
    );
    expect(detail.socials.email).toBeNull();
  });

  it("should throw error when extension not found", async () => {
    await expect(
      firefoxDetailAPI.getDetail("nonexistent-extension-id")
    ).rejects.toThrow("Extension not found.");
  });

  it("should throw error when extension id is not provided", async () => {
    await expect(firefoxDetailAPI.getDetail("")).rejects.toThrow(
      "Extension id is required"
    );
  });
});
