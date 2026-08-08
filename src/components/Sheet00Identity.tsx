import { ArrowUpRight, Mail } from "lucide-react";

export default function Sheet00Identity() {
  return (
    <section className="mb-4">
      <div className="flex justify-between items-end border-b border-slate-border pb-2 mb-6 text-slate-muted text-xs uppercase tracking-widest">
        <span>SHEET 00 / IDENTITY</span>
        <span>44.4268° N · 26.1025° E</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        ANTONIE—GABRIEL BELU
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
        <div className="md:col-span-4 flex flex-col gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-muted uppercase text-xs mb-1">ROLE</span>
            <span>SYSTEMS PROGRAMMER / CS STUDENT</span>
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            <a href="https://github.com/belutoni" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent-teal transition-colors w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GITHUB <ArrowUpRight className="w-4 h-4 text-slate-muted" />
            </a>
            <a href="mailto:belutoni06@gmail.com" className="flex items-center gap-2 hover:text-accent-teal transition-colors w-fit">
              <Mail className="w-4 h-4" /> EMAIL <ArrowUpRight className="w-4 h-4 text-slate-muted" />
            </a>
          </div>
        </div>
        
        <div className="md:col-span-8 text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
          "I design software where architecture becomes tangible—kernels, firmware, boot flows, assemblers, and the tools that make machines understandable."
        </div>
      </div>
    </section>
  );
}
