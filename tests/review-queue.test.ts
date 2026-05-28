import { describe, expect, it } from "vitest";
import {
  addWrong,
  getDue,
  makeExerciseRef,
  markCorrect,
  type ReviewEntry,
} from "~/lib/review-queue";

const DAY = 24 * 60 * 60 * 1000;
const D0 = "2026-05-01T09:00:00.000Z";

function iso(base: string, plusDays = 0): string {
  return new Date(new Date(base).getTime() + plusDays * DAY).toISOString();
}

const REF = makeExerciseRef("vue-reactivity.ref-vs-reactive", "ex1");

describe("review queue", () => {
  it("addWrong は Box1 / dueAt = +1日 で追加する", () => {
    const next = addWrong([], REF, D0);
    expect(next).toHaveLength(1);
    expect(next[0].box).toBe(1);
    expect(next[0].dueAt).toBe(iso(D0, 1));
    expect(next[0].lastResult).toBe("wrong");
  });

  it("既存エントリへの addWrong は Box1 にリセットする", () => {
    let q: ReviewEntry[] = addWrong([], REF, D0);
    q = markCorrect(q, REF, iso(D0, 1));
    expect(q[0].box).toBe(2);
    q = addWrong(q, REF, iso(D0, 2));
    expect(q).toHaveLength(1);
    expect(q[0].box).toBe(1);
    expect(q[0].dueAt).toBe(iso(D0, 3));
  });

  it("markCorrect で Box1→Box2 / dueAt = +3日", () => {
    const q1 = addWrong([], REF, D0);
    const q2 = markCorrect(q1, REF, iso(D0, 1));
    expect(q2[0].box).toBe(2);
    expect(q2[0].dueAt).toBe(iso(iso(D0, 1), 3));
    expect(q2[0].lastResult).toBe("correct");
  });

  it("markCorrect で Box2→Box3 / dueAt = +7日", () => {
    let q: ReviewEntry[] = addWrong([], REF, D0);
    q = markCorrect(q, REF, iso(D0, 1));
    q = markCorrect(q, REF, iso(D0, 4));
    expect(q[0].box).toBe(3);
    expect(q[0].dueAt).toBe(iso(iso(D0, 4), 7));
  });

  it("Box3 で markCorrect すると卒業（キューから消える）", () => {
    let q: ReviewEntry[] = addWrong([], REF, D0);
    q = markCorrect(q, REF, iso(D0, 1));
    q = markCorrect(q, REF, iso(D0, 4));
    q = markCorrect(q, REF, iso(D0, 11));
    expect(q).toHaveLength(0);
  });

  it("対象エントリが無い markCorrect はキューを変更しない", () => {
    const q: ReviewEntry[] = addWrong([], REF, D0);
    const q2 = markCorrect(q, "other-lesson#ex9", iso(D0, 1));
    expect(q2).toEqual(q);
  });

  it("getDue は dueAt <= now のものを dueAt 昇順で返す", () => {
    const refA = "a#1";
    const refB = "b#1";
    const refC = "c#1";
    let q: ReviewEntry[] = [];
    q = addWrong(q, refA, D0);
    q = addWrong(q, refB, iso(D0, 1));
    q = addWrong(q, refC, iso(D0, 5));
    const due = getDue(q, iso(D0, 3));
    expect(due.map((e) => e.exerciseRef)).toEqual([refA, refB]);
  });

  it("getDue の limit で件数を絞れる（getDueToday の最大3問の根拠）", () => {
    let q: ReviewEntry[] = [];
    for (let i = 0; i < 5; i++) {
      q = addWrong(q, `lesson#ex${i}`, D0);
    }
    const due = getDue(q, iso(D0, 1), 3);
    expect(due).toHaveLength(3);
  });
});
