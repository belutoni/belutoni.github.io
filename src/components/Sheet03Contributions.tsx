import { GitCommit } from "lucide-react";

export default function Sheet03Contributions() {
  const contributions = [
    {
      project: "LibreOffice Engine",
      lang: "C++",
      patch: "Gerrit Change 203225",
      detail: "Resolved a VBA compatibility bug in the LibreOffice Basic Runtime engine. Integrated automated unit tests in StarBASIC.",
      link: "https://gerrit.libreoffice.org/c/core/+/203225"
    },
    {
      project: "egui GUI Library",
      lang: "Rust",
      patch: "Pull Request #7817",
      detail: "Identified and solved a legacy architectural bug (active since 2023) handling widget click event bounds. (20M+ Downloads)",
      link: "https://github.com/emilk/egui/pull/7817"
    }
  ];

  return (
    <section id="contributions" className="mb-4">
      <div className="flex justify-between items-end border-b border-slate-border pb-2 mb-8 text-slate-muted text-xs uppercase tracking-widest">
        <span>SHEET 03 / OPEN-SOURCE CONTRIBUTIONS</span>
      </div>
      
      <h2 className="text-2xl mb-10 text-slate-300">Code in the wild.</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contributions.map((contrib, idx) => (
          <a href={contrib.link} target="_blank" rel="noopener noreferrer" key={idx} className="border border-slate-border p-6 bg-[#0a101a] hover:border-slate-500 transition-colors relative group block cursor-pointer">
            <div className="absolute top-4 right-4 text-slate-border group-hover:text-accent-teal transition-colors">
              <GitCommit className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-foreground">{contrib.project}</h3>
              <span className="text-xs px-2 py-0.5 bg-slate-border/50 text-slate-muted border border-slate-border uppercase">
                {contrib.lang}
              </span>
            </div>
            
            <div className="text-accent-teal font-mono text-sm mb-4">
              Patch: {contrib.patch}
            </div>
            
            <p className="text-sm text-slate-300">
              {contrib.detail}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
