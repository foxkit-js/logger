import { test } from "uvu";
import { is } from "uvu/assert";
import { padStr } from "../src/padStr";

test("padding left", () => {
  is(padStr("foo", { len: 5, direction: "left" }), "  foo");
});

test("padding right", () => {
  is(padStr("foo", { len: 5, direction: "right" }), "foo  ");
});

test("padding centered", () => {
  is(
    padStr("foo", { len: 5, direction: "center" }),
    " foo ",
    "test without needing bias"
  );
  is(
    padStr("foo", { len: 6, direction: "center" }),
    " foo  ",
    "test with default bias (left)"
  );
  is(
    padStr("foo", { len: 6, direction: "center", bias: "left" }),
    " foo  ",
    "test with left bias"
  );
  is(
    padStr("foo", { len: 6, direction: "center", bias: "right" }),
    "  foo ",
    "test with right bias"
  );
});

test("padding skipped", () => {
  is(
    padStr("foo", { len: 3, direction: "left" }),
    "foo",
    "test with length = string length"
  );
  is(
    padStr("foobar", { len: 3, direction: "left" }),
    "foobar",
    "test with length smaller than string length"
  );
});

test.run();
