const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const site = path.join(__dirname, "../site");
const home = fs.readFileSync(path.join(site, "index.html"), "utf8");

function controls() {
  const control = (initial = {}) => ({
    events: new Map(),
    attributes: new Map(),
    hidden: false,
    disabled: false,
    textContent: "",
    setAttribute(key, value) { this.attributes.set(key, value); },
    removeAttribute(key) { this.attributes.delete(key); },
    toggleAttribute(key, value) {
      if (value) this.setAttribute(key, "");
      else this.removeAttribute(key);
    },
    addEventListener(type, listener) { this.events.set(type, listener); },
    click() {
      if (!this.disabled) this.events.get("click")();
    },
    focus() { this.focused = true; },
    ...initial,
  });

  const buttons = Array.from({ length: 4 }, () => control({ disabled: true }));
  const stages = buttons.map((button) => control({ querySelector: () => button }));
  const statuses = Array.from({ length: 3 }, () => control());
  const nodes = statuses.map((status) => control({ querySelector: () => status }));
  const next = control();
  const reset = control();
  const detail = control();
  const actions = control({ hidden: true });
  const toggle = control({ hidden: true });
  const content = control();
  const root = {
    dataset: {},
    querySelectorAll(selector) {
      return { "[data-trace-step]": stages, "[data-trace-node]": nodes }[selector];
    },
    querySelector(selector) {
      return {
        "#trace-next": next, "#trace-reset": reset, "#trace-detail": detail,
        ".trace-actions": actions, ".window-toggle": toggle, "#trace-content": content,
      }[selector];
    },
  };
  const source = fs.readFileSync(path.join(site, "assets/bean-trace.js"), "utf8");
  vm.runInNewContext(source, { document: { querySelector: () => root } });

  return {
    next, reset, detail, actions, buttons, toggle, content,
    current: () => stages.flatMap((stage, index) =>
      stage.attributes.get("aria-current") === "step" ? [index] : []),
    activeNode: () => nodes.findIndex((node) => node.attributes.has("data-active")),
    flow: () => statuses.map((status) => status.textContent),
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
  assert.equal(trace.activeNode(), 1);
  assert.deepEqual(trace.flow(), ["File still here", "1 pending retry", "Awaiting file"]);

  trace.next.click();
  assert.deepEqual(trace.current(), [3]);
  assert.match(trace.detail.textContent, /Documents/);
  assert.equal(trace.activeNode(), 2);
  assert.deepEqual(trace.flow(), ["File moved", "Empty", "invoice.pdf"]);
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

test("timeline buttons select events and minimizing preserves the current state", () => {
  const trace = controls();
  trace.buttons[2].click();
  assert.deepEqual(trace.current(), [2]);
  assert.equal(trace.toggle.hidden, false);

  trace.toggle.click();
  assert.equal(trace.content.hidden, true);
  assert.equal(trace.toggle.attributes.get("aria-expanded"), "false");
  assert.equal(trace.toggle.attributes.get("aria-label"), "Restore bean window");

  trace.toggle.click();
  assert.equal(trace.content.hidden, false);
  assert.equal(trace.toggle.attributes.get("aria-expanded"), "true");
  assert.equal(trace.toggle.attributes.get("aria-label"), "Minimize bean window");
  assert.deepEqual(trace.current(), [2]);
  assert.equal(trace.activeNode(), 1);
});

test("home includes the static trace, background and all honors, with no cache demo", () => {
  assert.equal((home.match(/data-trace-step/g) ?? []).length, 4);
  assert.match(home, /class="trace-actions" hidden/);
  assert.match(home, /id="trace-detail" role="status"/);
  assert.match(home, /<noscript>[\s\S]*?invoice\.pdf[\s\S]*?<\/noscript>/);
  for (const id of ["work", "open-source", "background", "about", "contact"]) assert(home.includes(`id="${id}"`));
  for (const honor of ["National ICT Olympiad", "MateInfoUB", "Acadnet Applied Informatics Olympiad", "Adolf Haimovici National Applied Mathematics Competition"]) {
    assert(home.includes(honor));
  }
  assert.doesNotMatch(home, /Cache lab|cache-lab|cache-demo|processor\.webp/i);
  assert.doesNotMatch(fs.readFileSync(path.join(site, "blog/index.html"), "utf8"), /Cache lab|\/#lab/i);
  assert.equal(fs.existsSync(path.join(site, "assets/cache-lab.js")), false);
});
