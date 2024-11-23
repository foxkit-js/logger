import { test } from "uvu";
import * as assert from "uvu/assert";
import { formatTime } from "../src/formatTime";
import { getLocalTimezone } from "./utils/getLocalTimezone";

const localTz = getLocalTimezone();
const sampleDate = new Date(`2024-11-23T00:17:32.123${localTz}`);

console.log(
  `Created sample time with offset ${localTz}:
  Local: ${sampleDate.toLocaleString()}
  UTC: ${sampleDate.toLocaleString(undefined, { timeZone: "UTC" })}`
);

test("basic date variables", () => {
  assert.is(
    formatTime("%iso_short%", sampleDate, false, 24),
    "2024-11-23",
    "test current date (%iso_short%)"
  );
  assert.is(
    formatTime("%time%", sampleDate, false, 24),
    "00:17:32",
    "test current time (%time%)"
  );
});

test("12hour notation", () => {
  assert.is(
    formatTime("%time%", sampleDate, false, 12),
    "12:17:32",
    "test current time with 12hr notation"
  );
  const date = new Date(`2024-11-23T14:25:36${localTz}`);
  assert.is(
    formatTime("%time%", date, false, 24),
    "14:25:36",
    "test a date at 2pm with 24hr notation"
  );
  assert.is(
    formatTime("%time%", date, false, 12),
    "02:25:36",
    "test a date at 2pm with 12hr notation"
  );
});

test("UTC vs local time", () => {
  // NOTE: this test will break in the year 10,000. You'll have to adjust the 19 below :)
  const utc = sampleDate.toISOString().slice(0, 19); // pls work
  const [date, time] = utc.split("T");
  assert.is(
    formatTime("%iso_short%", sampleDate, true, 24),
    date,
    "test %iso_short% for UTC"
  );
  assert.is(
    formatTime("%time%", sampleDate, true, 24),
    time,
    "test %time% for UTC"
  );
});

test("other variables", () => {
  const otherDate = new Date(`2024-12-25T12:17:32.023${localTz}`);
  assert.is(
    formatTime("%month_short%", sampleDate, false, 24),
    "Nov",
    "test %month_short% on sample time"
  );
  assert.is(
    formatTime("%month_short%", otherDate, false, 24),
    "Dec",
    "test %month_short% on other time"
  );

  assert.is(
    formatTime("%date_ord%", sampleDate, false, 24),
    "23rd",
    "test %date_ord% on sample time (with '3rd')"
  );
  assert.is(
    formatTime("%date_ord%", otherDate, false, 24),
    "25th",
    "test %date_ord% on day with 'th'"
  );

  assert.is(
    formatTime("%day%", sampleDate, false, 24),
    "Sat",
    "test %day% on sample time"
  );
  assert.is(
    formatTime("%day%", otherDate, false, 24),
    "Wed",
    "test %day% on other time"
  );

  assert.is(
    formatTime("%ampm%", sampleDate, false, 12),
    "am",
    "test %ampm% with sample time (am)"
  );
  assert.is(
    formatTime("%ampm%", otherDate, false, 12),
    "pm",
    "test %ampm% with other time (pm)"
  );
  assert.is(
    formatTime("%AMPM%", otherDate, false, 12),
    "PM",
    "test %AMPM% with other time (PM, capitalized)"
  );
});

test.run();
