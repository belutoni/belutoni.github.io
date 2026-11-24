const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const home = fs.readFileSync(path.join(__dirname, "../site/index.html"), "utf8");

function controls() {
  const control = () => ({
    events: new Map(),
    attributes: new Map(),
    hidden: true,
    disabled: false,
    textContent: "",
    setAttribute(key, value) { this.attributes.set(key, value); },
    removeAttribute(key) { this.attributes.delete(key); },
    addEventListener(type, listener) { this.events.set(type, listener); },
    click() { this.events.get("click")(); },
    focus() { this.focused = true; },
  });

  const stages = Array.from({ length: 4 }, control);
  const next = control();
  const reset = control();
  const detail = control();
  const actions = control();
  const root = {
    querySelectorAll(selector) {
      assert.equal(selector, "[data-trace-step]");
      return stages;
    },
    querySelector(selector) {
      return { "#trace-next": next, "#trace-reset": reset, "#trace-detail": detail, ".trace-actions": actions }[selector];
    },
  };
  const source = fs.readFileSync(path.join(__dirname, "../site/assets/bean-trace.js"), "utf8");
  vm.runInNewContext(source, { document: { querySelector: () => root } });

  return {
    next,
    reset,
    detail,
    actions,
    current: () => stages.flatMap((stage, index) =>
      stage.attributes.get("aria-current") === "step" ? [index] : []),
  };
}

test("advances through a lock and a successful retry, then replays and resets", () => {
  const trace = controls();
  assert.equal(trace.actions.hidden, false);
  assert.deepEqual(trace.current(), [0]);
  assert.equal(trace.reset.disabled, true);
  assert.match(trace.detail.textContent, /indefinitely/);

  trace.next.click();
  assert.deepEqual(trace.current(), [1]);
  assert.equal(trace.reset.disabled, false);
  assert.match(trace.detail.textContent, /500 ms/);

  trace.next.click();
  assert.deepEqual(trace.current(), [2]);
  assert.match(trace.detail.textContent, /one second/);

  trace.next.click();
  assert.deepEqual(trace.current(), [3]);
  assert.match(trace.detail.textContent, /Documents/);
  assert.equal(trace.next.textContent, "Replay trace");

  trace.next.click();
  assert.deepEqual(trace.current(), [0]);
  assert.equal(trace.next.textContent, "Next event");

  trace.next.click();
  trace.reset.click();
  assert.deepEqual(trace.current(), [0]);
  assert.equal(trace.next.focused, true);
  assert.equal(trace.reset.disabled, true);
});

test("home includes the complete static trace and hides uninitialized controls", () => {
  assert.equal((home.match(/data-trace-step/g) ?? []).length, 4);
  assert.match(home, /class="trace-actions" hidden/);
  assert.match(home, /id="trace-detail" role="status"/);
  assert.match(home, /<noscript>[\s\S]*?invoice\.pdf[\s\S]*?<\/noscript>/);
  for (const id of ["work", "lab", "about", "contact"]) assert(home.includes(`id="${id}"`));
  assert.doesNotMatch(home, /processor\.webp/);
});
