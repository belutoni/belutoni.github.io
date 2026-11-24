const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const site = path.join(__dirname, "../site");
const home = fs.readFileSync(path.join(site, "index.html"), "utf8");
const source = fs.readFileSync(path.join(site, "assets/bean-trace.js"), "utf8");

function fixture() {
  function element(properties = {}) {
    return {
      attributes: new Map(),
      handlers: new Map(),
      dataset: {},
      style: { setProperty() {} },
      setAttribute(name, value) { this.attributes.set(name, value); },
      removeAttribute(name) { this.attributes.delete(name); },
      toggleAttribute(name, value) {
        if (value) this.setAttribute(name, "");
        else this.removeAttribute(name);
      },
      addEventListener(type, handler) { this.handlers.set(type, handler); },
      dispatch(type = "click") { this.handlers.get(type)(); },
      getAnimations() { return []; },
      replaceChildren(...children) { this.children = children; },
      ...properties,
    };
  }

  const buttons = Object.fromEntries(["signal", "wake", "scan", "attempt"].map((id) => [
    id, element({ dataset: { traceJump: id }, querySelector: () => element() }),
  ]));
  const objects = Array.from({ length: 3 }, () => element());
  const plots = ["handle", "worker"].map((kind) => element({ dataset: { wave: kind }, nextElementSibling: element() }));
  const selectors = [
    ".trace-scope", ".trace-storage", "#trace-event", "#trace-api", "#trace-detail", "#trace-progress",
    "#trace-position", "#trace-play", "#trace-next", "#trace-reset", "#trace-scenario", ".window-toggle",
    "#trace-content", ".trace-packet", ".trace-transfer", ".trace-waveforms", ".trace-input", ".trace-controls",
  ];
  const controls = Object.fromEntries(selectors.map((selector) => [selector, element()]));
  controls["#trace-scenario"].value = "locked";
  controls[".trace-waveforms"].querySelectorAll = () => plots;
  const root = element({
    querySelector: (selector) => controls[selector],
    querySelectorAll: (selector) => ({
      "[data-trace-jump]": Object.values(buttons),
      "[data-trace-object]": objects.map((status) => element({ querySelector: () => status })),
    })[selector],
  });
  const timers = new Map();
  let timerId = 0;
  vm.runInNewContext(source, {
    document: { querySelector: () => root, createElement: () => element() },
    matchMedia: () => ({ matches: true }),
    setTimeout(callback) {
      timers.set(++timerId, callback);
      return timerId;
    },
    clearTimeout: (id) => timers.delete(id),
  });
  return {
    buttons, controls, timers,
    event: () => root.dataset.event,
    statuses: () => objects.map((object) => object.textContent),
    waves: () => plots.map((plot) => plot.nextElementSibling.textContent),
    step: () => controls["#trace-next"].dispatch(),
    scenario(value) {
      controls["#trace-scenario"].value = value;
      controls["#trace-scenario"].dispatch("change");
    },
    tick() {
      const [id, callback] = timers.entries().next().value;
      timers.delete(id);
      callback();
    },
  };
}

test("Windows signals before the worker rearms, waits, and scans", () => {
  const trace = fixture();
  assert.deepEqual(trace.waves(), ["Armed", "Blocked"]);
  trace.step();
  assert.equal(trace.event(), "signal");
  assert.deepEqual(trace.waves(), ["Signaled", "Ready"]);
  assert.match(trace.controls["#trace-detail"].textContent, /no filename/);
  trace.step();
  assert.equal(trace.event(), "wake");
  assert.deepEqual(trace.waves(), ["Rearmed", "Running"]);
  trace.step();
  assert.equal(trace.event(), "settle");
  assert.deepEqual(trace.waves(), ["Rearmed", "500 ms wait"]);
  trace.step();
  assert.equal(trace.event(), "scan");
});

test("a locked file stays in Downloads during the pending retry", () => {
  const trace = fixture();
  trace.buttons.attempt.dispatch();
  trace.step();
  assert.equal(trace.event(), "locked");
  assert.deepEqual(trace.statuses(), ["invoice.pdf still here", "1 pending move", "No file"]);
  trace.step();
  assert.equal(trace.event(), "backoff");
  assert.deepEqual(trace.waves(), ["Rearmed", "1 s wait"]);
  trace.step();
  assert.equal(trace.event(), "retry");
  assert.match(trace.controls["#trace-api"].textContent, /WAIT_TIMEOUT/);
  trace.step();
  assert.equal(trace.event(), "moved");
  assert.deepEqual(trace.statuses(), ["File left Downloads", "Empty", "invoice.pdf"]);
  assert.equal(trace.controls["#trace-play"].textContent, "Replay trace");
});

test("the ready and collision paths use the appropriate destination names", () => {
  const trace = fixture();
  trace.scenario("ready");
  trace.buttons.attempt.dispatch();
  trace.step();
  assert.equal(trace.event(), "moved");
  assert.deepEqual(trace.statuses(), ["File left Downloads", "Empty", "invoice.pdf"]);

  trace.scenario("collision");
  assert.equal(trace.event(), "idle");
  assert.equal(trace.statuses()[2], "invoice.pdf already here");
  trace.buttons.attempt.dispatch();
  trace.step();
  assert.equal(trace.event(), "collision");
  assert.deepEqual(trace.statuses(), ["invoice.pdf", "Empty", "invoice.pdf already here"]);
  trace.step();
  assert.equal(trace.event(), "renamed");
  assert.equal(trace.statuses()[2], "invoice (1).pdf added");
});

test("playback pauses and restarts without leaving a scheduled step behind", () => {
  const trace = fixture();
  const { "#trace-play": play, "#trace-reset": reset, ".window-toggle": toggle, "#trace-content": content } = trace.controls;
  play.dispatch();
  assert.equal(trace.event(), "signal");
  assert.equal(trace.timers.size, 1);
  trace.tick();
  assert.equal(trace.event(), "wake");
  play.dispatch();
  assert.equal(trace.timers.size, 0);
  play.dispatch();
  toggle.dispatch();
  assert.equal(trace.timers.size, 0);
  assert.equal(content.hidden, true);
  toggle.dispatch();
  assert.equal(content.hidden, false);
  assert.equal(trace.event(), "settle");
  reset.dispatch();
  assert.equal(trace.event(), "idle");
});

test("home includes the static trace, background and all honors, with no cache demo", () => {
  assert.equal((home.match(/data-trace-jump/g) ?? []).length, 4);
  assert.match(home, /id="bean-window-label">bean</);
  assert.match(home, /class="trace-controls" hidden/);
  assert.match(home, /class="trace-readout" role="status"/);
  assert.match(home, /<noscript>[\s\S]*?MoveFileExW[\s\S]*?<\/noscript>/);
  for (const id of ["work", "open-source", "background", "about", "contact"]) assert(home.includes(`id="${id}"`));
  for (const honor of ["National ICT Olympiad", "MateInfoUB", "Acadnet Applied Informatics Olympiad", "Adolf Haimovici National Applied Mathematics Competition"]) {
    assert(home.includes(honor));
  }
  assert.doesNotMatch(home, /Cache lab|cache-lab|cache-demo|processor\.webp/i);
  assert.doesNotMatch(fs.readFileSync(path.join(site, "blog/index.html"), "utf8"), /Cache lab|\/#lab/i);
  assert.equal(fs.existsSync(path.join(site, "assets/cache-lab.js")), false);
});
