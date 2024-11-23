import { test } from "uvu";
import * as assert from "uvu/assert";
import { formatTime } from "../src/formatTime";
import { getLocalTimezone } from "./utils/getLocalTimezone";

// need to actually get local timezone for these tests
// TODO: actually set a non-UTC tz in tests (see https://github.com/szenius/set-timezone/blob/master/index.mjs#L12)
const localTz = getLocalTimezone();
const sampleDate = new Date(`2024-11-23T00:17:32.123${localTz}`);

console.log(
  `Created sample time with offset ${localTz}: ${sampleDate.toLocaleString()}`
);

// TODO: messages on all of these tests below

test("basic date variables", () => {
  assert.is(formatTime("%iso_short%", sampleDate, false, 24), "2024-11-23");
  assert.is(formatTime("%time%", sampleDate, false, 24), "00:17:32");
});

test("12hour notation", () => {
  assert.is(formatTime("%time%", sampleDate, false, 12), "12:17:32");
  const date = new Date(`2024-11-23T14:25:36${localTz}`);
  assert.is(formatTime("%time%", date, false, 24), "14:25:36");
  assert.is(formatTime("%time%", date, false, 12), "02:25:36");
});

test("UTC vs local time", () => {
  // NOTE: this test will break in the year 10,000. You'll have to adjust the 19 below :)
  const utc = sampleDate.toISOString().slice(0, 19); // pls work
  const [date, time] = utc.split("T");
  assert.is(formatTime("%iso_short%", sampleDate, true, 24), date);
  assert.is(formatTime("%time%", sampleDate, true, 24), time);
});

test("other variables", () => {
  const otherDate = new Date(`2024-12-25T00:17:32.123${localTz}`);
  assert.is(formatTime("%month_short%", sampleDate, false, 24), "Nov");
  assert.is(formatTime("%month_short%", otherDate, false, 24), "Dec");

  assert.is(formatTime("%date_ord%", sampleDate, false, 24), "23rd");
  assert.is(formatTime("%date_ord%", otherDate, false, 24), "25th");

  assert.is(formatTime("%day%", sampleDate, false, 24), "Sat");
  assert.is(formatTime("%day%", otherDate, false, 24), "Wed");
});

test.run();
