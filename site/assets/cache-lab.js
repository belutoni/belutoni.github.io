const demo = document.querySelector("#cache-demo");
const memoryRows = Array.from(demo.querySelectorAll("#memory tbody tr"));
const code = demo.querySelector("#traversal-code");
const reads = demo.querySelector("#reads");
const hitCount = demo.querySelector("#hits");
const missCount = demo.querySelector("#misses");
const lines = demo.querySelector("#lines");
const lastRead = demo.querySelector("#last-read");
const announcement = demo.querySelector("#lab-announcement");
const run = demo.querySelector("#run");
const step = demo.querySelector("#step");
const reset = demo.querySelector("#reset");
const patterns = demo.querySelector(".patterns");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const width = 4;
const cacheCapacity = 2;

let cache = [];
let traversal = [];
let cursor = 0;
let hits = 0;
let misses = 0;
let currentCell = null;
let timer = null;

function address(line) {
  return `0x${(line * 16).toString(16).padStart(2, "0")}`;
}

function describeCounters() {
  return `${hits} ${hits === 1 ? "hit" : "hits"} and ${misses} ${misses === 1 ? "miss" : "misses"}.`;
}

function render() {
  reads.firstChild.textContent = cursor;
  hitCount.textContent = hits;
  missCount.textContent = misses;
  lines.textContent = cache.length ? cache.map(address).join(" · ") : "Empty";
  memoryRows.forEach((row, index) => {
    row.classList.toggle("is-cached", cache.includes(index));
  });

  const finished = cursor === traversal.length;
  const running = timer !== null;
  run.setAttribute("aria-disabled", String(running || finished));
  step.setAttribute("aria-disabled", String(running || finished));
}

function restart(message) {
  window.clearInterval(timer);
  timer = null;
  cache = [];
  cursor = 0;
  hits = 0;
  misses = 0;
  currentCell?.classList.remove("is-current", "is-hit", "is-miss");
  currentCell = null;
  lastRead.textContent = "Cache is empty.";

  const byRow = demo.querySelector("input[name='pattern']:checked").value === "row";
  traversal = Array.from({ length: width * width }, (_, index) => {
    const outer = Math.floor(index / width);
    const inner = index % width;
    return byRow ? [outer, inner] : [inner, outer];
  });
  const [outer, inner] = byRow ? ["r", "c"] : ["c", "r"];
  code.textContent = [
    `for (int ${outer} = 0; ${outer} < 4; ++${outer})`,
    `  for (int ${inner} = 0; ${inner} < 4; ++${inner})`,
    "    read(matrix[r][c]);",
  ].join("\n");
  announcement.textContent = message;
  render();
}

function readNext() {
  const [row, column] = traversal[cursor++];
  const cachedIndex = cache.indexOf(row);
  const hit = cachedIndex !== -1;
  if (hit) {
    cache.splice(cachedIndex, 1);
    hits++;
  } else {
    if (cache.length === cacheCapacity) cache.shift();
    misses++;
  }
  cache.push(row);

  currentCell?.classList.remove("is-current", "is-hit", "is-miss");
  currentCell = memoryRows[row].cells[column + 1];
  currentCell.classList.add("is-current", hit ? "is-hit" : "is-miss");
  const result = `Read matrix[${row}][${column}] · Cache ${hit ? "hit" : "miss"}`;
  lastRead.textContent = result;
  return result;
}

function tick() {
  readNext();
  if (cursor === traversal.length) {
    window.clearInterval(timer);
    timer = null;
    announcement.textContent = `Traversal complete. ${describeCounters()}`;
  }
  render();
}

run.addEventListener("click", () => {
  if (timer !== null || cursor === traversal.length) return;
  if (reducedMotion.matches) {
    while (cursor < traversal.length) readNext();
    announcement.textContent = `Traversal complete. ${describeCounters()}`;
    render();
    return;
  }
  timer = window.setInterval(tick, 145);
  tick();
});

step.addEventListener("click", () => {
  if (timer !== null || cursor === traversal.length) return;
  const result = readNext();
  announcement.textContent = `${result}. ${describeCounters()}`;
  render();
});

reset.addEventListener("click", () => restart("Cache and counters reset."));
patterns.addEventListener("change", () => restart("Traversal order changed. Cache and counters reset."));
for (const control of [patterns, run, step, reset]) control.disabled = false;
restart("");
