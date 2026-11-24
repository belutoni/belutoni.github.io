{
  const trace = document.querySelector("#bean-trace");
  const stages = Array.from(trace.querySelectorAll("[data-trace-step]"));
  const detail = trace.querySelector("#trace-detail");
  const next = trace.querySelector("#trace-next");
  const reset = trace.querySelector("#trace-reset");
  const explanations = [
    "The retry queue is empty. bean waits indefinitely for a directory change or a stop signal.",
    "Windows signals a change. bean rearms the watcher and gives the file 500 ms to settle before scanning.",
    "The move hits a lock. bean adds the file to its retry queue and waits up to one second before trying again.",
    "The file unlocks before the retry. bean moves invoice.pdf to Documents.",
  ];
  let active = 0;

  function show(index) {
    active = index;
    stages.forEach((stage, position) => {
      if (position === index) stage.setAttribute("aria-current", "step");
      else stage.removeAttribute("aria-current");
    });
    detail.textContent = explanations[index];
    next.textContent = index === stages.length - 1 ? "Replay trace" : "Next event";
    reset.disabled = index === 0;
  }

  next.addEventListener("click", () => show((active + 1) % stages.length));
  reset.addEventListener("click", () => {
    show(0);
    next.focus();
  });
  show(0);
  trace.querySelector(".trace-actions").hidden = false;
}
