const hex = (number) => number.toString(16).toUpperCase().padStart(2, '0');
const address = (number) => `0x${hex(number)}`;

const frames = [...document.querySelectorAll('[data-frame]')];
const frameLinks = [...document.querySelectorAll('header a[href^="#"], .frame-index a')];
const addressOutputs = document.querySelectorAll('[data-address]');
const offsetOutputs = document.querySelectorAll('[data-offset]');
const frameLabel = document.querySelector('[data-frame-name]');
const progressBar = document.querySelector('[data-progress]');
const frameWidth = 0x20;

let frameStops = [];
let lastFrame;
let lastOffset;
let pendingFrame;

function updatePosition() {
  pendingFrame = undefined;

  const scroll = window.scrollY;
  const activeIndex = frameStops.findLastIndex((stop) => stop <= scroll + 1);
  const frame = frames[activeIndex];
  const end = frameStops[activeIndex + 1] ?? document.documentElement.scrollHeight - window.innerHeight;
  const span = end - frameStops[activeIndex];
  const progress = span > 0 ? Math.max(0, Math.min(1, (scroll - frameStops[activeIndex]) / span)) : 0;
  const offset = Math.min(frameWidth - 1, Math.floor(progress * frameWidth));

  progressBar.style.transform = `scaleX(${progress})`;
  if (frame !== lastFrame) {
    for (const link of frameLinks) {
      if (link.hash === '#' + frame.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    frameLabel.textContent = frame.dataset.label;
  }

  if (frame !== lastFrame || offset !== lastOffset) {
    const current = address(Number(frame.dataset.frame) + offset);
    for (const output of addressOutputs) output.textContent = current;
    for (const output of offsetOutputs) output.textContent = '+' + address(offset);
    lastFrame = frame;
    lastOffset = offset;
  }
}

function schedulePosition() {
  if (pendingFrame === undefined) pendingFrame = requestAnimationFrame(updatePosition);
}

function measureFrames() {
  const root = document.documentElement;
  const limit = Math.max(0, root.scrollHeight - window.innerHeight);
  const inset = parseFloat(getComputedStyle(root).scrollPaddingTop);
  frameStops = frames.map((frame) => Math.max(0, Math.min(limit, frame.getBoundingClientRect().top + window.scrollY - inset)));
  frameStops[0] = 0;
  schedulePosition();
}

measureFrames();
new ResizeObserver(measureFrames).observe(document.body);
window.addEventListener('resize', measureFrames);
window.addEventListener('scroll', schedulePosition, { passive: true });

const lab = document.querySelector('#memory-lab');
const byteMap = lab.querySelector('#byte-map');
const byteDetail = lab.querySelector('#byte-detail');
const declaration = lab.querySelector('#declaration');
const note = lab.querySelector('#language-note');
const fields = [
  { name: 'flags', size: 1, cpp: 'std::uint8_t', rust: 'u8' },
  { name: 'timestamp', size: 8, cpp: 'std::uint64_t', rust: 'u64' },
  { name: 'sequence', size: 4, cpp: 'std::uint32_t', rust: 'u32' },
];
const alignUp = (value, alignment) => Math.ceil(value / alignment) * alignment;

let bytes = [];
let activeByte = 0;

function selectByte(index, focus = false) {
  const previous = byteMap.children[activeByte];
  if (previous) {
    previous.tabIndex = -1;
    previous.setAttribute('aria-pressed', 'false');
  }

  activeByte = index;
  const button = byteMap.children[index];
  button.tabIndex = 0;
  button.setAttribute('aria-pressed', 'true');
  if (focus) button.focus({ preventScroll: true });

  const cell = bytes[index];
  const position = document.createElement('strong');
  position.textContent = '+' + address(index);
  const detail = cell.name === 'padding'
    ? `${cell.type} · ${cell.size} ${cell.size === 1 ? 'byte' : 'bytes'}`
    : `${cell.name} · ${cell.type} · byte ${index - cell.start + 1} of ${cell.size}`;
  byteDetail.replaceChildren(position, ' · ' + detail);
}

function renderLayout() {
  const language = lab.querySelector('input[name="language"]:checked').value;
  const compact = lab.querySelector('input[name="order"]:checked').value === 'compact';
  const ordered = compact ? [...fields].sort((left, right) => right.size - left.size) : fields;
  const alignment = Math.max(...fields.map((field) => field.size));
  const isRust = language === 'rust';
  bytes = [];

  function padTo(end, type) {
    const count = end - bytes.length;
    const padding = { name: 'padding', type, size: count };
    for (let index = 0; index < count; index += 1) bytes.push(padding);
  }

  for (const field of ordered) {
    padTo(alignUp(bytes.length, field.size), 'Alignment padding');
    const cell = { name: field.name, type: field[language], start: bytes.length, size: field.size };
    for (let index = 0; index < field.size; index += 1) bytes.push(cell);
  }
  padTo(alignUp(bytes.length, alignment), 'Tail padding');

  const lines = ordered.map((field) => isRust
    ? `  ${field.name}: ${field.rust},`
    : `  ${field.cpp} ${field.name};`);
  const keyword = document.createElement('span');
  keyword.className = 'syntax';
  keyword.textContent = isRust ? '#[repr(C)]\nstruct' : '#include <cstdint>\n\nstruct';
  declaration.replaceChildren(keyword, ` Sample {\n${lines.join('\n')}\n${isRust ? '}' : '};'}`);
  note.textContent = isRust
    ? 'repr(C) uses C-compatible field order and alignment. Rust’s default representation can reorder fields.'
    : 'The standard-layout struct preserves declaration order. The ABI supplies size and alignment for each integer type.';

  const buttons = bytes.map((cell, index) => {
    const button = document.createElement('button');
    button.className = 'byte';
    button.type = 'button';
    button.tabIndex = -1;
    button.dataset.kind = cell.name;
    button.dataset.index = index;
    button.textContent = hex(index);
    button.setAttribute('aria-label', `Offset ${address(index)}, ${cell.name === 'padding' ? cell.type : cell.name}`);
    button.setAttribute('aria-pressed', 'false');
    return button;
  });
  byteMap.replaceChildren(...buttons);
  lab.querySelector('#layout-size').textContent = bytes.length + ' B';
  lab.querySelector('#layout-alignment').textContent = alignment + ' B';
  lab.querySelector('#layout-padding').textContent = bytes.filter((cell) => cell.name === 'padding').length + ' B';
  selectByte(0);
}

byteMap.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (button) selectByte(Number(button.dataset.index));
});

byteMap.addEventListener('focusin', (event) => {
  const button = event.target.closest('button');
  if (button && Number(button.dataset.index) !== activeByte) selectByte(Number(button.dataset.index));
});

byteMap.addEventListener('keydown', (event) => {
  const moves = {
    ArrowLeft: Math.max(0, activeByte - 1),
    ArrowRight: Math.min(bytes.length - 1, activeByte + 1),
    ArrowUp: Math.max(0, activeByte - 8),
    ArrowDown: Math.min(bytes.length - 1, activeByte + 8),
    Home: 0,
    End: bytes.length - 1,
  };
  if (!Object.hasOwn(moves, event.key)) return;
  event.preventDefault();
  selectByte(moves[event.key], true);
});

lab.addEventListener('change', renderLayout);
renderLayout();
for (const region of lab.querySelectorAll('[hidden]')) region.hidden = false;
