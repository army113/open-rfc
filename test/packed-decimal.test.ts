import assert from "node:assert/strict";
import test from "node:test";

import { decodePackedDecimal } from "../src/values/packed-decimal.js";

test("packed decimal: a field of all zero bytes decodes as zero", () => {
  // A packed field the ABAP side never initialised arrives as all zero bytes,
  // with no sign nibble. SAP GUI shows it as 0.
  for (const [hex, decimals] of [
    ["00", 0],
    ["00000000", 0],
    ["0000000000000000", 2],
  ] as const) {
    const zero = decodePackedDecimal(Buffer.from(hex, "hex"), decimals, "P");
    const positiveZero = decodePackedDecimal(
      Buffer.from(`${hex.slice(0, -1)}c`, "hex"),
      decimals,
      "P",
    );
    assert.equal(zero, positiveZero, `${hex}/${decimals}`);
  }
});

test("packed decimal: a zero sign nibble after a digit is still refused", () => {
  assert.throws(
    () => decodePackedDecimal(Buffer.from("0010", "hex"), 0, "P"),
    /invalid sign nibble 0/u,
  );
});
