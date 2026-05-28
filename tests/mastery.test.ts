import { describe, expect, it } from "vitest";
import { EMPTY_PROGRESS, nextMastery } from "~/lib/mastery";

const DAY = 24 * 60 * 60 * 1000;

function iso(base: string, plusDays = 0): string {
  return new Date(new Date(base).getTime() + plusDays * DAY).toISOString();
}

const D0 = "2026-05-01T09:00:00.000Z";

describe("nextMastery", () => {
  it("初回完走で★0→★1", () => {
    const next = nextMastery(EMPTY_PROGRESS, false, D0);
    expect(next.mastery).toBe(1);
    expect(next.firstCompletedAt).toBe(D0);
    expect(next.lastCompletedAt).toBe(D0);
    expect(next.masteryUpdatedAt).toBe(D0);
    expect(next.attempts).toBe(1);
  });

  it("同日に再挑戦して全問正解しても★1のまま", () => {
    const after1 = nextMastery(EMPTY_PROGRESS, false, D0);
    const next = nextMastery(after1, true, iso(D0, 0));
    expect(next.mastery).toBe(1);
    expect(next.attempts).toBe(2);
  });

  it("別日に全問正解で★1→★2", () => {
    const after1 = nextMastery(EMPTY_PROGRESS, false, D0);
    const next = nextMastery(after1, true, iso(D0, 1));
    expect(next.mastery).toBe(2);
    expect(next.masteryUpdatedAt).toBe(iso(D0, 1));
  });

  it("別日でも誤答があれば★2に上がらない", () => {
    const after1 = nextMastery(EMPTY_PROGRESS, false, D0);
    const next = nextMastery(after1, false, iso(D0, 2));
    expect(next.mastery).toBe(1);
  });

  it("★2達成後、3日未満では★3に上がらない", () => {
    const a = nextMastery(EMPTY_PROGRESS, false, D0);
    const b = nextMastery(a, true, iso(D0, 1));
    expect(b.mastery).toBe(2);
    const c = nextMastery(b, true, iso(D0, 3));
    expect(c.mastery).toBe(2);
  });

  it("★2達成から3日以上空けて全問正解で★3", () => {
    const a = nextMastery(EMPTY_PROGRESS, false, D0);
    const b = nextMastery(a, true, iso(D0, 1));
    const c = nextMastery(b, true, iso(D0, 4));
    expect(c.mastery).toBe(3);
    expect(c.masteryUpdatedAt).toBe(iso(D0, 4));
  });

  it("★3達成後はそれ以上上がらない", () => {
    const a = nextMastery(EMPTY_PROGRESS, false, D0);
    const b = nextMastery(a, true, iso(D0, 1));
    const c = nextMastery(b, true, iso(D0, 4));
    const d = nextMastery(c, true, iso(D0, 10));
    expect(d.mastery).toBe(3);
    expect(d.attempts).toBe(4);
  });
});
