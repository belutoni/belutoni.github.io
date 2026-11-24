# belux0.dev field manual

## Intent

Introduce Antonie-Gabriel Belu through the engineering decisions in his own work. The main audience includes engineers and internship recruiters. A visitor should be able to identify his modern C++ and systems focus, try an example, and reach the source or contact details without reading the entire page. The redesign answers the previous version's generic processor image, repeated card layout, and decorative labels. Keep a dark theme, keep Rust visible through egui, and keep the existing emphasis on software.

## Approaches

- **Project-led field manual.** Start with a real scenario from bean and turn it into a small explorable engineering figure. Follow it with two differently composed case studies. This grounds the design in the author's code and makes the first screen useful to both technical and casual visitors. The site owner selected this approach.
- **Interactive byte map.** Teach C++ struct padding with a comparison of two member orders. This would make a clear standalone demo, but the central example would introduce a language concept independently of the author's work.

## Visual system

| Role | Choice |
| --- | --- |
| Midnight indigo | `#1A2248` page canvas |
| Cover blue | `#283972` trace cover and case-study accents |
| Frost | `#EEF0FF` main text |
| Blue paper | `#DCE5FF` trace surface |
| Ink | `#232745` trace text |
| Amber | `#FFD39E` delayed retry treatment |

Use Newsreader for large headings and Recursive in its proportional setting for body text and controls. Use a monospace system stack for literal code, files, and API names only. Set body copy at 16 px or above and keep its measure below 80 characters.

At desktop widths, begin with a masthead and a wide split composition. The introduction sits left; the trace begins on the right and extends below it, like a full-size figure alongside a short introduction. Let the figure carry the visual weight. At small widths, stack the introduction, figure, and case studies. Put controls below the figure in reading order. Use left alignment except for small figures where positional alignment conveys a state.

```text
belux0.dev                           Projects   Experiments   About   Contact

Antonie-Gabriel Belu        +---------------------------------------------+
Systems programmer          | bean: what happens to a locked download?    |
Modern C++ / Bucharest      | Downloads -> Windows event -> retry -> move |
Project + GitHub links      | Current explanation     Next event   Reset  |
                             +---------------------------------------------+

bean   Why the watcher sleeps         bost   How the kernel gets control
       C++23 + Win32                         NASM -> Protected mode -> C++23

Open-source changes            Existing Cache Lab             About / contact
```

Reserve the figure's bright color and depth for the bean trace. Let the case studies have different compositions suited to their subjects. Avoid decorative numbered headings, generic image treatments, and recurring eyebrow text. Use motion only to clarify a state change and respect reduced motion.

## Trace and content

The figure uses an illustrative `invoice.pdf`. A file-name change wakes bean's Win32 wait, followed by a 500 ms settling window. A move attempt encounters a lock. With a file in the retry queue, bean's wait has a one-second timeout. The illustrated file becomes available before the next attempt, so the retry moves it to Documents. Idle waiting is indefinite when the retry queue is empty. The timestamps describe the modeled example and the real wait settings. The trace does not act on local files.

Provide an initial diagram with all stage names and a short explanation if scripting is unavailable. With scripting enabled, `Next event` changes one stage at a time, and `Reset` returns to the waiting state. Both controls work by keyboard. Keep the selected stage visible in text and announce the changed explanation to assistive technology. At the end, the same primary control can replay from the beginning.

Tell the story of bean's notification-driven architecture, deferred retry queue and collision-safe moves. For bost, show the x86 boot path from assembly through 32-bit protected mode to the C++ kernel and explain its type-safe VGA text formatting. Link to the real source. Include LibreOffice and egui contributions, education, internship availability, and email. Preserve the existing notes and their URLs.

## Build and verification

Keep static HTML, CSS, and JavaScript on GitHub Pages, with no runtime dependencies or process that handles files. Preserve `#work`, `#lab`, `#about`, `#contact`, `/blog/`, and `/blog/hello-world/`. Preserve the Cache Lab controls and behavior as a lower-page experiment. Keep the trace in a focused script independent of the existing cache script. Serve any new fonts locally and include their licenses.

Verify each stage of the bean trace, reset, replay, keyboard activation, and a usable initial state without JavaScript. Check responsive layout at narrow mobile and desktop widths, the unchanged cache outcomes, and links to the notes and sources. Deploy to the existing custom domain using the existing Pages workflow and check the live result.

The layout proportions, graphics, and exact copy are implementation decisions within this direction. The trace depicts one successful retry scenario. Additional failure scenarios, backend services, and new pages are outside the redesign.
