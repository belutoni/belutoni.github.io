{
  const trace = document.querySelector("#bean-trace");
  const stages = Array.from(trace.querySelectorAll("[data-trace-step]"));
  const nodes = Array.from(trace.querySelectorAll("[data-trace-node]"));
  const detail = trace.querySelector("#trace-detail");
  const next = trace.querySelector("#trace-next");
  const reset = trace.querySelector("#trace-reset");
  const toggle = trace.querySelector(".window-toggle");
  const content = trace.querySelector("#trace-content");
  const events = [
    {
      node: 0,
      status: ["Watching", "Empty", "Awaiting file"],
      detail: "The retry queue is empty. bean waits indefinitely for a directory change or a stop signal.",
    },
    {
      node: 0,
      status: ["invoice.pdf", "Empty", "Awaiting file"],
      detail: "Windows signals a change. bean rearms the watcher and gives the file 500 ms to settle before scanning.",
    },
    {
      node: 1,
      status: ["File still here", "1 pending retry", "Awaiting file"],
      detail: "The file is locked in Downloads. bean queues the move and waits up to one second before retrying.",
    },
    {
      node: 2,
      status: ["File moved", "Empty", "invoice.pdf"],
      detail: "The file unlocks before the retry. bean moves invoice.pdf to Documents and clears the retry queue.",
    },
  ];
  let active = 0;

  function show(index) {
    active = index;
    const event = events[index];
    trace.dataset.stage = String(index);
    stages.forEach((stage, position) => {
      if (position === index) stage.setAttribute("aria-current", "step");
      else stage.removeAttribute("aria-current");
    });
    nodes.forEach((node, position) => {
      node.toggleAttribute("data-active", position === event.node);
      node.querySelector("[data-node-status]").textContent = event.status[position];
    });
    detail.textContent = event.detail;
    next.textContent = index === stages.length - 1 ? "Replay trace" : "Next event";
    reset.disabled = index === 0;
  }

  stages.forEach((stage, index) => {
    const button = stage.querySelector("[data-trace-jump]");
    button.addEventListener("click", () => show(index));
    button.disabled = false;
  });
  next.addEventListener("click", () => show((active + 1) % stages.length));
  reset.addEventListener("click", () => {
    show(0);
    next.focus();
  });
  toggle.addEventListener("click", () => {
    content.hidden = !content.hidden;
    toggle.setAttribute("aria-expanded", String(!content.hidden));
    toggle.setAttribute("aria-label", content.hidden ? "Restore bean window" : "Minimize bean window");
  });
  show(0);
  toggle.hidden = false;
  trace.querySelector(".trace-actions").hidden = false;
}
