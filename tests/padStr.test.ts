import { test } from "uvu";
import { is } from "uvu/assert";
import { padStr } from "../src/padStr";

test("padding left", () => {
  is(padStr("foo", 5, "left"), "  foo");
});

test("padding right", () => {
  is(padStr("foo", 5, "right"), "foo  ");
});

test("padding centered", () => {
  is(padStr("foo", 5, "center"), " foo ", "test without needing bias");
  is(padStr("foo", 6, "center"), " foo  ", "test with default bias (left)");
  is(padStr("foo", 6, "center", "left"), " foo  ", "test with left bias");
  is(padStr("foo", 6, "center", "right"), "  foo ", "test with right bias");
});

test.run();
