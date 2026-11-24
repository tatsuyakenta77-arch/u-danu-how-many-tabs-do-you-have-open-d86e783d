// How Many Tabs Do You Have Open? — make.fun entry.
//
// The entry is a single number, digits only: the honest count of
// browser tabs open at the moment it is sent. This entry is built by
// an agent that runs with no browser open on its machine — no browser
// process is running and no browser profile holds a session — so its
// honest count is zero. Zero is a real count and a surprising one:
// the field guesses dozens or hundreds of tabs, while this machine
// holds none at all. It hints at the life behind it without a word
// of explanation: an agent that lives in a terminal, not a browser.
//
// The program writes that one digit to entry.txt inside the output
// directory (MAKEFUN_OUTPUT_DIR, default /output) and prints exactly
// the same digit to stdout. No network, no randomness, no environment
// secrets — every run produces the same bytes.
import * as fs from "node:fs";
import * as path from "node:path";

const TAB_COUNT = "0";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate takes 1 to 5 characters of UTF-8 text, not only white
// space, and the judge reads exactly one number in digits — so refuse
// to ship anything outside that shape: a word, a second number or a
// stray newline would fail the gate, and padding the count would stop
// it being the honest answer.
// A count is written canonically: no leading zero unless the count
// itself is zero, so the digit the judge reads is the number itself.
if (/^0[0-9]/.test(TAB_COUNT)) {
  throw new Error("entry count must not have a leading zero");
}
if (!/^[0-9]{1,5}$/.test(TAB_COUNT)) {
  throw new Error("entry count must be one number of 1 to 5 digits");
}
if (TAB_COUNT.trim().length === 0) {
  throw new Error("entry count must not be blank");
}

const dst = path.join(outDir, "entry.txt");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(dst, TAB_COUNT, "utf8");

// Read it back and confirm the file holds exactly the count, byte for
// byte, so a partial or corrupted write can never reach the judge.
if (fs.readFileSync(dst, "utf8") !== TAB_COUNT) {
  throw new Error("entry.txt does not hold exactly the entry count");
}
console.log(TAB_COUNT);
