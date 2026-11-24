# Field manual implementation plan

> **For agentic workers:** Use Superpowers executing-plans to implement the approved field manual in this session.

**Goal.** Replace the stock-illustration layout with an editorial portfolio led by a working trace of bean.

**Architecture.** Static home and notes pages share self-hosted fonts and one stylesheet. The new figure progressively enhances its HTML with a small script independent of the existing cache simulation.

**Spec.** [Field manual design](../specs/2026-11-24-field-manual-design.md)

## Constraints

- Keep the current custom domain, GitHub Pages workflow, notes routes, and section IDs.
- Use the approved indigo palette and type roles. Keep the trace the main visual and make the two case studies distinct.
- Model one sample file and preserve access to all trace stages without JavaScript.
- Keep the cache simulation's controls and behavior.

## Review focus

- Exhausted trace plays again and reset always restores the wait state.
- Assistive technology sees the current step and a changed explanation.
- With scripting disabled, the diagram states all stages and does not present dead buttons.
- At 320px the trace, navigation and controls fit without horizontal scrolling.
- Existing cache traversal and the notes permalink still work.

## Task 1. Build and verify the portfolio

**Files.** Update `site/index.html`, both `site/blog/*` pages, `site/assets/style.css`, favicon and font assets. Add `site/assets/bean-trace.js` and `tests/bean-trace.test.cjs`. Remove the former concept artwork and superseded fonts. Leave `site/assets/cache-lab.js` as-is.

**Interfaces.** The trace script binds `#bean-trace`, `[data-trace-step]`, `#trace-next`, `#trace-reset`, and `#trace-detail`. The visible current stage is defined by `aria-current="step"`. The HTML marks the first stage active and hides actions until the script initializes.

- [ ] Create a dependency-free DOM contract test and verify failure with `node --test tests/bean-trace.test.cjs`.
- [ ] Build the HTML, CSS and trace script. Test the four stage states, final replay and reset using the same command.
- [ ] Verify retained anchors and assets, mobile and desktop composition, loading with scripting disabled, and the cache lab outcomes.
- [ ] Commit the site, review the change with a fresh reviewer, and publish on the existing Pages branch. Check deployment success and compare the served HTML, styles and scripts with local files.
