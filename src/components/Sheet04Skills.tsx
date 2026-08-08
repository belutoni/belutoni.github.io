export default function Sheet04Skills() {
  return (
    <section id="skills" className="mb-4">
      <div className="flex justify-between items-end border-b border-slate-border pb-2 mb-8 text-slate-muted text-xs uppercase tracking-widest">
        <span>SHEET 04 / HONORS & TECHNICAL SKILLS</span>
      </div>
      
      <h2 className="text-2xl mb-10 text-slate-300">Capabilities & Recognition</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Skills Inventory */}
        <div>
          <h3 className="text-sm text-accent-teal uppercase tracking-widest mb-6 border-b border-slate-border/50 pb-2">Skills Inventory</h3>
          
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-xs text-slate-muted uppercase mb-2">Languages</div>
              <div className="text-foreground text-sm leading-relaxed">
                Embedded C, C++, Zig, Rust, Assembly (x86/ARMv8), Python
              </div>
            </div>
            
            <div>
              <div className="text-xs text-slate-muted uppercase mb-2">Tooling & Subsystems</div>
              <div className="text-foreground text-sm leading-relaxed flex flex-wrap gap-2">
                {["Linux Kernel", "U-Boot", "Buildroot", "QEMU", "GNU Make", "CMake", "Git"].map(tool => (
                  <span key={tool} className="border border-slate-border px-2 py-1 text-xs">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Honors List */}
        <div>
          <h3 className="text-sm text-accent-teal uppercase tracking-widest mb-6 border-b border-slate-border/50 pb-2">Honors List</h3>
          
          <ul className="flex flex-col gap-4 text-sm text-slate-300">
            <li className="flex gap-4">
              <span className="text-slate-muted">01</span>
              <span>Bronze Medal (National Phase) & 2nd Place (County) - National ICT Olympiad (C#)</span>
            </li>
            <li className="flex gap-4">
              <span className="text-slate-muted">02</span>
              <span>3rd Place - MateInfoUB Informatics Competition</span>
            </li>
            <li className="flex gap-4">
              <span className="text-slate-muted">03</span>
              <span>2nd Place - Acadnet Applied Informatics Olympiad</span>
            </li>
            <li className="flex gap-4">
              <span className="text-slate-muted">04</span>
              <span>1st Place - Adolf Haimovici National Applied Mathematics Competition</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
