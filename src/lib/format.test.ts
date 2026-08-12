import { describe, expect, it } from "vitest";
import { fmtDate, PRIORITY_META, STATUS_META } from "@/lib/format";

describe("fmtDate", () => {
  it("returns an empty string for nullish input", () => {
    expect(fmtDate(null)).toBe("");
    expect(fmtDate(undefined)).toBe("");
  });

  it("formats a Date as 'day mon'", () => {
    expect(fmtDate(new Date(2026, 0, 5))).toBe("5 ene");
  });

  it("formats a date string the same way as a Date", () => {
    const iso = "2026-08-20T00:00:00";
    expect(fmtDate(iso)).toBe(fmtDate(new Date(iso)));
  });
});

describe("STATUS_META / PRIORITY_META", () => {
  it("has a label for every task status", () => {
    expect(Object.keys(STATUS_META)).toEqual(["backlog", "progress", "done"]);
  });

  it("has a label for every task priority", () => {
    expect(Object.keys(PRIORITY_META)).toEqual(["baja", "media", "alta", "urgente"]);
  });
});
