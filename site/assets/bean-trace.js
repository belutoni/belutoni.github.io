{
  const trace = document.querySelector("#bean-trace");
  const field = document.querySelector(".signal-field");
  const scope = trace.querySelector(".trace-scope");
  const storage = trace.querySelector(".trace-storage");
  const nodes = Array.from(trace.querySelectorAll("[data-trace-jump]"));
  const objects = Array.from(trace.querySelectorAll("[data-trace-object]"));
  const eventLabel = trace.querySelector("#trace-event");
  const apiLink = trace.querySelector("#trace-api");
  const detail = trace.querySelector("#trace-detail");
  const progress = trace.querySelector("#trace-progress");
  const position = trace.querySelector("#trace-position");
  const play = trace.querySelector("#trace-play");
  const next = trace.querySelector("#trace-next");
  const reset = trace.querySelector("#trace-reset");
  const scenario = trace.querySelector("#trace-scenario");
  const toggle = trace.querySelector(".window-toggle");
  const content = trace.querySelector("#trace-content");
  const signalPacket = trace.querySelector(".trace-packet");
  const filePacket = trace.querySelector(".trace-transfer");
  const waveforms = trace.querySelector(".trace-waveforms");
  const waves = Array.from(waveforms.querySelectorAll("[data-wave]"), (wave) => ({
    kind: wave.dataset.wave,
    plot: wave,
    status: wave.nextElementSibling,
  }));
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const source = "https://github.com/belutoni/bean/blob/42bf3ffc6ce3c1d63e9696c27fb47793c626f26b/src/organizer.cpp#";

  const events = {
    idle: {
      node: "wake",
      api: "WaitForMultipleObjects",
      lines: "L379-L395",
      label: "Waiting for a change",
      detail: "With an empty retry queue, the worker blocks on the change and stop handles. The example file hasn’t arrived yet.",
    },
    signal: {
      node: "signal",
      api: "FILE_NOTIFY_CHANGE_FILE_NAME",
      lines: "L374-L388",
      label: "Windows signals the change handle",
      detail: "invoice.pdf appears in Downloads. Windows signals that a filename changed. The handle carries no filename.",
    },
    wake: {
      node: "wake",
      api: "FindNextChangeNotification",
      lines: "L392-L408",
      label: "The waiting worker wakes",
      detail: "WaitForMultipleObjects returns WAIT_OBJECT_0 + 1. bean rearms the notification before doing any directory work.",
      from: "signal",
    },
    settle: {
      node: "wake",
      api: "WaitForSingleObject",
      lines: "L409-L417",
      label: "500 ms to let changes settle",
      detail: "The worker waits on the stop event for up to 500 ms. That leaves room for a burst of changes while keeping shutdown responsive.",
      tone: "wait",
    },
    scan: {
      node: "scan",
      api: "std::filesystem::directory_iterator",
      lines: "L94-L168",
      label: "The scan finds invoice.pdf",
      detail: "bean enumerates Downloads, normalizes the extension, and maps .pdf to the Documents known folder using its default rules.",
      from: "wake",
    },
    attempt: {
      node: "attempt",
      api: "MoveFileExW",
      lines: "L40-L63",
      label: "Try the destination path",
      detail: "bean passes the source and candidate destination to Win32 without MOVEFILE_REPLACE_EXISTING. Windows rejects an occupied name.",
      from: "scan",
    },
    locked: {
      node: "attempt",
      api: "ERROR_SHARING_VIOLATION",
      lines: "L64-L69",
      label: "The file is in use",
      detail: "The file remains in Downloads. bean queues its source and destination paths for another attempt.",
      tone: "wait",
      transfer: [0, 1],
    },
    backoff: {
      node: "wake",
      api: "WaitForMultipleObjects",
      lines: "L390-L395",
      label: "The worker blocks with a retry pending",
      detail: "With a file in the retry queue, the wait is limited to 1,000 ms. A stop signal or another directory change could wake it sooner.",
      tone: "wait",
    },
    retry: {
      node: "attempt",
      api: "WAIT_TIMEOUT",
      lines: "L392-L422",
      label: "The retry wait expires",
      detail: "In this example no new change arrives. The wait expires, the download has unlocked, and bean tries MoveFileExW again.",
      tone: "wait",
      transfer: [1, 0],
    },
    collision: {
      node: "attempt",
      api: "ERROR_ALREADY_EXISTS",
      lines: "L48-L62",
      label: "The destination name is taken",
      detail: "Windows rejects the first candidate. bean tries invoice (1).pdf in the same loop, without replacing the file already in Documents.",
      tone: "wait",
    },
    moved: {
      node: "attempt",
      api: "MoveFileExW",
      lines: "L40-L56",
      label: "The file is now in Documents",
      detail: "Win32 returns success. invoice.pdf leaves Downloads and appears at the destination, with no pending retry.",
      tone: "done",
      transfer: [0, 2],
    },
    renamed: {
      node: "attempt",
      api: "MoveFileExW",
      lines: "L48-L62",
      label: "Both documents are preserved",
      detail: "Windows moves the download as invoice (1).pdf. The existing invoice.pdf stays where it was.",
      tone: "done",
      transfer: [0, 2],
    },
  };

  const prefix = ["idle", "signal", "wake", "settle", "scan", "attempt"];
  const paths = {
    locked: [...prefix, "locked", "backoff", "retry", "moved"],
    ready: [...prefix, "moved"],
    collision: [...prefix, "collision", "renamed"],
  };
  const workerState = {
    idle: "Blocked",
    signal: "Ready",
    settle: "500 ms wait",
    backoff: "1 s wait",
  };
  let index = 0;
  let playing = false;
  let timer;

  const currentPath = () => paths[scenario.value];
  const complete = () => index === currentPath().length - 1;

  function updateActions() {
    play.textContent = playing ? "Pause" : complete() ? "Replay trace" : "Run trace";
    next.setAttribute("aria-disabled", String(complete()));
    reset.setAttribute("aria-disabled", String(index === 0 && !playing));
  }

  function stop() {
    clearTimeout(timer);
    playing = false;
    updateActions();
  }

  function renderObjects(id, event) {
    const moved = event.tone === "done";
    const pending = ["locked", "backoff", "retry"].includes(id);
    const status = [
      id === "idle" ? "Awaiting invoice.pdf" : moved ? "File left Downloads" : pending ? "invoice.pdf still here" : "invoice.pdf",
      pending ? "1 pending move" : "Empty",
      moved ? (id === "renamed" ? "invoice (1).pdf added" : "invoice.pdf") :
        scenario.value === "collision" ? "invoice.pdf already here" : "No file",
    ];
    objects.forEach((object, i) => {
      object.toggleAttribute("data-active", i === 0 ? id !== "idle" && !moved : i === 1 ? pending : moved || id === "collision");
      object.querySelector("[data-object-status]").textContent = status[i];
    });
  }

  function renderWaveforms(path, step) {
    const id = path[step];
    waveforms.style.setProperty("--cursor", (step + .5) / path.length * 100 + "%");
    for (const wave of waves) {
      const handle = wave.kind === "handle";
      const slots = path.slice(0, step + 1).map((event) => handle ? event === "signal" : !Object.hasOwn(workerState, event));
      wave.plot.style.gridTemplateColumns = `repeat(${path.length}, minmax(0, 1fr))`;
      const samples = slots.map((high, i) => {
        const sample = document.createElement("span");
        sample.dataset.level = high ? "high" : "low";
        sample.toggleAttribute("data-edge", i > 0 && high !== slots[i - 1]);
        return sample;
      });
      wave.plot.replaceChildren(...samples);
      wave.status.textContent = handle
        ? (id === "signal" ? "Signaled" : step > 1 ? "Rearmed" : "Armed")
        : (workerState[id] ?? "Running");
    }
  }

  function animatePacket(packet, layer, from, to, duration) {
    packet.getAnimations().forEach((animation) => animation.cancel());
    if (motion.matches || content.hidden) return;

    const origin = layer.getBoundingClientRect();
    const point = (element) => {
      const rect = element.getBoundingClientRect();
      return [rect.left - origin.left + (rect.width - packet.offsetWidth) / 2,
        rect.top - origin.top + (rect.height - packet.offsetHeight) / 2];
    };
    const end = point(to);
    const start = from ? point(from) : [end[0] - 19, end[1]];
    const translate = ([x, y]) => `translate(${x}px, ${y}px)`;
    packet.animate([
      { transform: translate(start), opacity: 0 },
      { opacity: 1, offset: .14 },
      { opacity: .95, offset: .85 },
      { transform: translate(end), opacity: 0 },
    ], { duration, easing: "cubic-bezier(.25, .05, .25, 1)" });
  }

  function render(step, animate = false) {
    index = step;
    const path = currentPath();
    const id = path[step];
    const event = events[id];
    trace.dataset.event = id;
    trace.dataset.tone = event.tone ?? "idle";
    field.dataset.phase = id === "idle" ? "" : event.node;
    field.dataset.tone = trace.dataset.tone;
    nodes.forEach((node) => {
      if (node.dataset.traceJump === event.node) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });
    eventLabel.textContent = event.label;
    apiLink.textContent = event.api;
    apiLink.href = source + event.lines;
    apiLink.setAttribute("aria-label", `View ${event.api} in the bean source`);
    detail.textContent = event.detail;
    position.textContent = [step + 1, path.length].map((n) => String(n).padStart(2, "0")).join(" / ");
    progress.style.transform = `scaleX(${step / (path.length - 1)})`;
    renderObjects(id, event);
    renderWaveforms(path, step);

    if (animate) {
      const icon = (key) => nodes.find((node) => node.dataset.traceJump === key)?.querySelector(".bus-icon");
      animatePacket(signalPacket, scope, icon(event.from), icon(event.node), event.from ? 660 : 350);
      if (event.transfer) {
        const [from, to] = event.transfer.map((i) => objects[i].querySelector(".object-icon"));
        filePacket.dataset.kind = event.tone === "done" ? "file" : "queue";
        animatePacket(filePacket, storage, from, to, 785);
      }
    } else {
      for (const packet of [signalPacket, filePacket]) {
        packet.getAnimations().forEach((animation) => animation.cancel());
      }
    }
    updateActions();
  }

  function tick() {
    render(index + 1, true);
    if (complete()) stop();
    else timer = setTimeout(tick, 1400);
  }

  play.addEventListener("click", () => {
    if (playing) {
      stop();
      return;
    }
    if (complete()) render(0);
    playing = true;
    tick();
  });
  next.addEventListener("click", () => {
    if (complete()) return;
    stop();
    render(index + 1, true);
  });
  reset.addEventListener("click", () => {
    if (index === 0 && !playing) return;
    stop();
    render(0);
  });
  scenario.addEventListener("change", () => {
    stop();
    render(0);
  });
  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      stop();
      render(currentPath().indexOf(node.dataset.traceJump), true);
    });
    node.disabled = false;
  });
  toggle.addEventListener("click", () => {
    stop();
    content.hidden = !content.hidden;
    toggle.setAttribute("aria-expanded", String(!content.hidden));
    toggle.setAttribute("aria-label", content.hidden ? "Restore bean window" : "Minimize bean window");
  });

  render(0);
  toggle.hidden = false;
  waveforms.hidden = false;
  trace.querySelector(".trace-input").hidden = false;
  trace.querySelector(".trace-controls").hidden = false;
}
